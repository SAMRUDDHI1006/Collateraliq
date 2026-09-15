'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TopNavbar } from '@/components/layout/TopNavbar';
import { Sidebar, NavView } from '@/components/layout/Sidebar';
import { MetricStrip } from '@/components/dashboard/MetricStrip';
import { AnalyticsGrid } from '@/components/dashboard/AnalyticsGrid';
import { LiveTrackingTable } from '@/components/dashboard/LiveTrackingTable';
import { ExecutiveTriagePanel } from '@/components/dashboard/ExecutiveTriagePanel';
import { CaseContextStrip } from '@/components/workbench/CaseContextStrip';
import { DocumentViewer } from '@/components/workbench/DocumentViewer';
import { VerificationMatrix } from '@/components/workbench/VerificationMatrix';
import { ValuationWorkbench } from '@/components/workbench/ValuationWorkbench';
import { StickyGovernanceFooter } from '@/components/workbench/StickyGovernanceFooter';
import { NewCaseModal } from '@/components/intake/NewCaseModal';
import { ClarificationModal } from '@/components/modals/ClarificationModal';
import { RejectDocketModal } from '@/components/modals/RejectDocketModal';
import { SanctionSuccessModal } from '@/components/modals/SanctionSuccessModal';
import { UserProfileDrawer } from '@/components/layout/UserProfileDrawer';
import { ValuerQueueView } from '@/components/views/ValuerQueueView';
import { AuditLogsView } from '@/components/views/AuditLogsView';
import { LoanCase, VerificationFieldComparison } from '@/types/collateral';
import { useCaseStore } from '@/context/CaseContext';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const {
    cases,
    benchmarks,
    auditLogs,
    loading,
    liveKpis,
    localityList,
    addCase,
    setCases,
    setAuditLogs,
  } = useCaseStore();

  const [currentView, setCurrentView] = useState<NavView | 'workbench'>('dashboard');
  const [selectedTab, setSelectedTab] = useState<string>('all');

  // Verification Workbench State
  const [selectedCaseId, setSelectedCaseId] = useState<string>('CLIQ-DADAR-001');
  const [currentCase, setCurrentCase] = useState<LoanCase | null>(null);
  const [verificationMatrix, setVerificationMatrix] = useState<VerificationFieldComparison[]>([]);
  const [highlightedField, setHighlightedField] = useState<string | null>('VF-04');
  const [exceptionAcknowledged, setExceptionAcknowledged] = useState<boolean>(false);

  // Modals & Drawers
  const [isIntakeModalOpen, setIsIntakeModalOpen] = useState<boolean>(false);
  const [isClarificationModalOpen, setIsClarificationModalOpen] = useState<boolean>(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState<boolean>(false);
  const [isSanctionSuccessModalOpen, setIsSanctionSuccessModalOpen] = useState<boolean>(false);
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState<boolean>(false);

  // Auth redirect check: enforce /login on every fresh visit, link click, page refresh (F5), or logout
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if page was refreshed (F5 / Reload)
    const navEntries = performance.getEntriesByType('navigation');
    const isReload = navEntries.length > 0 && (navEntries[0] as PerformanceNavigationTiming).type === 'reload';

    if (isReload) {
      sessionStorage.clear();
      localStorage.removeItem('collateral_iq_auth');
      localStorage.removeItem('collateraliq_auth');
      document.cookie = 'collateral_iq_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      document.cookie = 'collateraliq_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      window.location.href = '/login';
      return;
    }

    const isAuth = sessionStorage.getItem('collateraliq_authenticated_session') === 'true';
    if (!isAuth) {
      window.location.href = '/login';
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.removeItem('collateral_iq_auth');
    localStorage.removeItem('collateraliq_auth');
    document.cookie = 'collateral_iq_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    document.cookie = 'collateraliq_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    window.location.href = '/login';
  };

  // Load initial flagship case once benchmarks are ready
  React.useEffect(() => {
    if (!loading && benchmarks && !currentCase) {
      loadCaseDetails('CLIQ-DADAR-001');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, benchmarks]);

  // Fetch case details when selectedCaseId changes
  const loadCaseDetails = async (caseId: string) => {
    try {
      const res = await fetch(`/api/cases/${caseId}`);
      if (res.ok) {
        const data = await res.json();
        setCurrentCase(data.case);
        setVerificationMatrix(data.verificationMatrix || []);
        setSelectedCaseId(caseId);
      }
    } catch (err) {
      console.error('Error loading case detail:', err);
    }
  };

  const handleSelectCase = (caseId: string) => {
    setSelectedCaseId(caseId);
    loadCaseDetails(caseId);
    setCurrentView('workbench');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTabChange = async (tab: string) => {
    setSelectedTab(tab);
    try {
      const res = await fetch(`/api/cases?tab=${tab}&limit=5000`);
      const data = await res.json();
      setCases(data.cases || []);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCaseCreated = (newCase: LoanCase) => {
    // addCase triggers context update → all KPIs recalculate via useMemo
    addCase(newCase);
    setSelectedCaseId(newCase.case_id);
    setCurrentCase(newCase);
    setExceptionAcknowledged(false);
    loadCaseDetails(newCase.case_id);
    setCurrentView('workbench');
  };

  const handleUpdateValuerAssessment = async (valData: {
    assessedValue: number;
    status: string;
    overrideReason: string;
    notes: string;
  }) => {
    if (!currentCase) return;
    try {
      const res = await fetch(`/api/cases/${currentCase.case_id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          valuer_assessed_value_inr: valData.assessedValue,
          valuer_status: valData.status,
          valuer_override_reason: valData.overrideReason,
        }),
      });
      if (res.ok) {
        const updated = await res.json();
        setCurrentCase(updated.case);
        // Refresh audit logs
        const aRes = await fetch(`/api/audit?case_id=${currentCase.case_id}`);
        const aData = await aRes.json();
        setAuditLogs(aData.logs || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleAcknowledge = async (val: boolean) => {
    setExceptionAcknowledged(val);
    if (val && currentCase) {
      await fetch(`/api/cases/${currentCase.case_id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ exception_acknowledged: true }),
      });
      const aRes = await fetch(`/api/audit?case_id=${currentCase.case_id}`);
      const aData = await aRes.json();
      setAuditLogs(aData.logs || []);
    }
  };

  const handleSubmitClarification = async (queryText: string, recipient: string) => {
    if (!currentCase) return;
    await fetch('/api/audit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        case_id: currentCase.case_id,
        officer_name: 'S. Nair',
        officer_role: 'Senior Credit Officer',
        action_type: 'RFI_SENT',
        description: `Underwriter RFI dispatched to ${recipient}: "${queryText}"`,
        previous_state: currentCase.collateral_assessment,
        new_state: 'Clarification Pending',
      }),
    });
    const aRes = await fetch(`/api/audit?case_id=${currentCase.case_id}`);
    const aData = await aRes.json();
    setAuditLogs(aData.logs || []);
  };

  const handleConfirmReject = async (reason: string, notes: string) => {
    if (!currentCase) return;
    await fetch('/api/audit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        case_id: currentCase.case_id,
        officer_name: 'S. Nair',
        officer_role: 'Senior Credit Officer',
        action_type: 'DOCKET_REJECTED',
        description: `Collateral docket declined. Reason: "${reason}". Officer Notes: "${notes}"`,
        previous_state: currentCase.collateral_assessment,
        new_state: 'DECLINED / REJECTED',
      }),
    });
    if (currentCase) {
      currentCase.collateral_assessment = 'HIGH - REVIEW REQUIRED';
    }
    const aRes = await fetch(`/api/audit?case_id=${currentCase.case_id}`);
    const aData = await aRes.json();
    setAuditLogs(aData.logs || []);
  };

  const handleProceedToSanction = async () => {
    if (!currentCase) return;
    await fetch('/api/audit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        case_id: currentCase.case_id,
        officer_name: 'S. Nair',
        officer_role: 'Senior Credit Officer',
        action_type: 'SANCTION_RECOMMENDED',
        description: `Facility recommended for formal Credit Committee sanction at INR ${(currentCase.loan_amount_inr / 1e7).toFixed(2)} Cr (LTV ${currentCase.ltv_percent.toFixed(1)}%). All exceptions acknowledged with HITL audit sign-off.`,
        previous_state: 'Review Complete',
        new_state: 'Sanction Recommended',
      }),
    });
    const aRes = await fetch(`/api/audit?case_id=${currentCase.case_id}`);
    const aData = await aRes.json();
    setAuditLogs(aData.logs || []);
    setIsSanctionSuccessModalOpen(true);
  };

  if (loading || !benchmarks) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white space-y-3">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        <span className="font-bold text-sm tracking-wide">Initializing CollateralIQ Calibrated Engine...</span>
        <span className="text-xs text-slate-400 font-mono">Calibrated against 3,000 Mumbai &amp; Thane cases</span>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-slate-950 font-sans text-slate-100 select-none">
      {/* Fixed 48px Top Navigation Bar */}
      <TopNavbar
        onSearchSelectCase={handleSelectCase}
        onOpenIntakeModal={() => setIsIntakeModalOpen(true)}
        onOpenProfileDrawer={() => setIsProfileDrawerOpen(true)}
        activeCases={cases}
      />

      {/* Main Viewport Flex Row */}
      <div className="flex-1 flex overflow-hidden min-h-0 relative">
        {/* Sidebar */}
        <Sidebar
          currentView={currentView === 'workbench' ? 'dashboard' : currentView}
          onSelectView={(v) => setCurrentView(v)}
          onOpenIntakeModal={() => setIsIntakeModalOpen(true)}
          valuerQueueCount={liveKpis.pendingValuerReview}
          isWorkbenchView={currentView === 'workbench'}
        />

        {/* Main Workspace Area */}
        <main className="flex-1 flex flex-col overflow-hidden min-h-0 bg-slate-950">
          {/* VIEW 1: Operations Dashboard (Screen 1) */}
          {currentView === 'dashboard' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
              {/* Executive 10-Second Collateral Triage Panel (Asset Risk Focus) */}
              <ExecutiveTriagePanel currentCase={currentCase} />

              {/* Live Tracking Stream Table */}
              <LiveTrackingTable
                cases={cases}
                onSelectCase={handleSelectCase}
                onTabChange={handleTabChange}
                selectedTab={selectedTab}
              />
            </div>
          )}

          {/* VIEW 2: Verification Workbench Hero Screen (Screen 3) */}
          {currentView === 'workbench' && currentCase && (
            <div className="flex flex-col h-full overflow-hidden min-h-0">
              {/* Top Case Context Strip */}
              <CaseContextStrip
                loanCase={currentCase}
                onBackToDashboard={() => setCurrentView('dashboard')}
              />

              {/* 3-Column Hero Workspace */}
              <div className="flex-1 grid grid-cols-12 gap-2.5 p-2.5 overflow-hidden min-h-0">
                {/* Left Column: Document Viewer */}
                <div className="col-span-12 lg:col-span-4 h-full min-h-0">
                  <DocumentViewer
                    loanCase={currentCase}
                    documentFileName={currentCase.uploaded_document_name}
                    highlightedField={highlightedField}
                    onSelectField={(fId) => setHighlightedField(fId)}
                  />
                </div>

                {/* Middle Column: Cross-Doc Verification Matrix */}
                <div className="col-span-12 lg:col-span-5 h-full min-h-0">
                  <VerificationMatrix
                    fields={verificationMatrix}
                    highlightedField={highlightedField}
                    onSelectField={(fId) => setHighlightedField(fId)}
                    exceptionAcknowledged={exceptionAcknowledged}
                    onToggleAcknowledge={handleToggleAcknowledge}
                  />
                </div>

                {/* Right Column: Valuation & Valuer Workbench */}
                <div className="col-span-12 lg:col-span-3 h-full min-h-0">
                  <ValuationWorkbench
                    loanCase={currentCase}
                    auditLogs={auditLogs}
                    onUpdateValuerAssessment={handleUpdateValuerAssessment}
                  />
                </div>
              </div>

              {/* Fixed 44px Sticky Governance Footer */}
              <StickyGovernanceFooter
                exceptionAcknowledged={exceptionAcknowledged}
                hasPendingExceptions={verificationMatrix.some((f) => f.status === 'DISCREPANCY')}
                onRequestClarification={() => setIsClarificationModalOpen(true)}
                onRejectDocket={() => setIsRejectModalOpen(true)}
                onProceedToSanction={handleProceedToSanction}
              />
            </div>
          )}

          {/* VIEW 3: Valuer Queue View */}
          {currentView === 'valuer_queue' && (
            <div className="flex-1 overflow-y-auto p-4 min-h-0">
              <ValuerQueueView
                cases={cases}
                onSelectCase={handleSelectCase}
              />
            </div>
          )}

          {/* VIEW 4: Audit Logs View */}
          {currentView === 'audit_logs' && (
            <div className="flex-1 overflow-y-auto p-4 min-h-0">
              <AuditLogsView
                logs={auditLogs}
                onSelectCase={handleSelectCase}
              />
            </div>
          )}

          {/* VIEW 5: Past Cases or Borrowers View */}
          {(currentView === 'past_cases' || currentView === 'borrowers') && (
            <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
              <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 shadow-sm text-slate-100">
                <h2 className="text-sm font-bold text-slate-100 capitalize">
                  {currentView === 'past_cases' ? 'Institutional Case Archive' : 'Active Borrower Registry'}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Archived collateral assessments across 22 micro-markets in Mumbai and Thane.
                </p>
              </div>
              <LiveTrackingTable
                cases={cases}
                onSelectCase={handleSelectCase}
                onTabChange={handleTabChange}
                selectedTab={selectedTab}
              />
            </div>
          )}
        </main>
      </div>

      {/* Screen 2: "+ New Loan Case" Intake Modal (3-Step Pipeline) */}
      <NewCaseModal
        isOpen={isIntakeModalOpen}
        onClose={() => setIsIntakeModalOpen(false)}
        onCaseCreated={handleCaseCreated}
        localityList={localityList}
      />

      {/* Governance Decision Modals */}
      {currentCase && (
        <>
          <ClarificationModal
            isOpen={isClarificationModalOpen}
            onClose={() => setIsClarificationModalOpen(false)}
            caseId={currentCase.case_id}
            borrowerName={currentCase.borrower_name}
            onSubmitClarification={handleSubmitClarification}
          />

          <RejectDocketModal
            isOpen={isRejectModalOpen}
            onClose={() => setIsRejectModalOpen(false)}
            caseId={currentCase.case_id}
            onConfirmReject={handleConfirmReject}
          />

          <SanctionSuccessModal
            isOpen={isSanctionSuccessModalOpen}
            onClose={() => setIsSanctionSuccessModalOpen(false)}
            loanCase={currentCase}
            onViewAuditTrail={() => {
              setCurrentView('audit_logs');
            }}
          />
        </>
      )}

      {/* User Profile Slide-Over Drawer */}
      <UserProfileDrawer
        isOpen={isProfileDrawerOpen}
        onClose={() => setIsProfileDrawerOpen(false)}
        onLogout={handleLogout}
        onSelectView={(v) => setCurrentView(v)}
      />
    </div>
  );
}
