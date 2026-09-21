'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TopNavbar } from '@/components/layout/TopNavbar';
import { Sidebar, NavView } from '@/components/layout/Sidebar';
import { MetricStrip } from '@/components/dashboard/MetricStrip';
import { AnalyticsGrid } from '@/components/dashboard/AnalyticsGrid';
import { LiveTrackingTable } from '@/components/dashboard/LiveTrackingTable';
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
import { CollateralAssessmentCase } from '@/types/collateral';
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

  // Verification Workbench State
  const [selectedCaseId, setSelectedCaseId] = useState<string>('CLIQ-DADAR-001');
  const [currentCase, setCurrentCase] = useState<CollateralAssessmentCase | null>(null);
  const [exceptionAcknowledged, setExceptionAcknowledged] = useState<boolean>(false);

  // Modals & Drawers
  const [isIntakeModalOpen, setIsIntakeModalOpen] = useState<boolean>(false);
  const [isClarificationModalOpen, setIsClarificationModalOpen] = useState<boolean>(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState<boolean>(false);
  const [isSanctionSuccessModalOpen, setIsSanctionSuccessModalOpen] = useState<boolean>(false);
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState<boolean>(false);

  // Auth redirect check
  useEffect(() => {
    if (typeof window === 'undefined') return;

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
    if (!loading && cases.length > 0 && !currentCase) {
      loadCaseDetails(selectedCaseId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, cases]);

  const loadCaseDetails = async (caseId: string) => {
    try {
      const res = await fetch(`/api/cases/${caseId}`);
      if (res.ok) {
        const data = await res.json();
        setCurrentCase(data.case);
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

  const handleCaseCreated = (newCase: CollateralAssessmentCase) => {
    addCase(newCase);
    setSelectedCaseId(newCase.caseId);
    setCurrentCase(newCase);
    setExceptionAcknowledged(false);
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
      const res = await fetch(`/api/cases/${currentCase.caseId}`, {
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
        const aRes = await fetch(`/api/audit?case_id=${currentCase.caseId}`);
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
      await fetch(`/api/cases/${currentCase.caseId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ exception_acknowledged: true }),
      });
      const aRes = await fetch(`/api/audit?case_id=${currentCase.caseId}`);
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
        case_id: currentCase.caseId,
        officer_name: 'S. Nair',
        officer_role: 'Senior Credit Officer',
        action_type: 'RFI_SENT',
        description: `Underwriter RFI dispatched to ${recipient}: "${queryText}"`,
        previous_state: currentCase.status,
        new_state: 'Clarification Pending',
      }),
    });
    const aRes = await fetch(`/api/audit?case_id=${currentCase.caseId}`);
    const aData = await aRes.json();
    setAuditLogs(aData.logs || []);
  };

  const handleConfirmReject = async (reason: string, notes: string) => {
    if (!currentCase) return;
    await fetch('/api/audit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        case_id: currentCase.caseId,
        officer_name: 'S. Nair',
        officer_role: 'Senior Credit Officer',
        action_type: 'DOCKET_REJECTED',
        description: `Collateral docket declined. Reason: "${reason}". Officer Notes: "${notes}"`,
        previous_state: currentCase.status,
        new_state: 'DECLINED / REJECTED',
      }),
    });
    const aRes = await fetch(`/api/audit?case_id=${currentCase.caseId}`);
    const aData = await aRes.json();
    setAuditLogs(aData.logs || []);
  };

  const handleProceedToSanction = async () => {
    if (!currentCase) return;
    await fetch('/api/audit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        case_id: currentCase.caseId,
        officer_name: 'S. Nair',
        officer_role: 'Senior Credit Officer',
        action_type: 'SANCTION_RECOMMENDED',
        description: `Facility recommended for formal Credit Committee sanction at INR ${(currentCase.loanFacilityRequested / 1e7).toFixed(2)} Cr. Valuation reconciliation sign-off completed.`,
        previous_state: currentCase.status,
        new_state: 'SANCTION_RECOMMENDED',
      }),
    });
    const aRes = await fetch(`/api/audit?case_id=${currentCase.caseId}`);
    const aData = await aRes.json();
    setAuditLogs(aData.logs || []);
    setIsSanctionSuccessModalOpen(true);
  };

  if (loading || !benchmarks) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white space-y-3">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        <span className="font-bold text-sm tracking-wide">Initializing Collateral Intelligence &amp; Valuation Reconciliation Engine...</span>
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
        activeCases={cases as any}
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
          {/* VIEW 1: Operations Dashboard */}
          {currentView === 'dashboard' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h1 className="text-lg font-extrabold text-slate-100 tracking-tight">
                    Collateral Intelligence &amp; Valuation Reconciliation Dashboard
                  </h1>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Model Indicative Valuation vs. IBBI Valuer Report Reconciliation Suite &bull; Mumbai &amp; Thane
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-emerald-300 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-700/60 font-semibold">
                    RBI Master Direction Aligned &bull; LTV &le; 75%
                  </span>
                </div>
              </div>

              <MetricStrip liveKpis={liveKpis} />

              <AnalyticsGrid
                liveKpis={liveKpis}
                localityBenchmarks={benchmarks.locality_benchmarks}
                onFilterLocality={(loc) => {
                  const match = cases.find((c) => c.propertyProfile.location === loc);
                  if (match) handleSelectCase(match.caseId);
                }}
              />

              <LiveTrackingTable
                cases={cases}
                onSelectCase={handleSelectCase}
              />
            </div>
          )}

          {/* VIEW 2: Verification Workbench Screen */}
          {currentView === 'workbench' && currentCase && (
            <div className="flex flex-col h-full overflow-hidden min-h-0">
              <CaseContextStrip
                loanCase={currentCase}
                onBackToDashboard={() => setCurrentView('dashboard')}
              />

              <div className="flex-1 grid grid-cols-12 gap-2.5 p-2.5 overflow-hidden min-h-0">
                <div className="col-span-12 lg:col-span-4 h-full min-h-0">
                  <DocumentViewer loanCase={currentCase} />
                </div>

                <div className="col-span-12 lg:col-span-5 h-full min-h-0">
                  <VerificationMatrix
                    loanCase={currentCase}
                    exceptionAcknowledged={exceptionAcknowledged}
                    onToggleAcknowledge={handleToggleAcknowledge}
                  />
                </div>

                <div className="col-span-12 lg:col-span-3 h-full min-h-0">
                  <ValuationWorkbench
                    loanCase={currentCase}
                    auditLogs={auditLogs}
                    onUpdateValuerAssessment={handleUpdateValuerAssessment}
                  />
                </div>
              </div>

              <StickyGovernanceFooter
                exceptionAcknowledged={exceptionAcknowledged}
                hasPendingExceptions={(currentCase.deviation?.percentageDiff || 0) > 10}
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
                cases={cases as any}
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
        </main>
      </div>

      {/* Intake Modal */}
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
            caseId={currentCase.caseId}
            borrowerName={currentCase.borrowerName}
            onSubmitClarification={handleSubmitClarification}
          />

          <RejectDocketModal
            isOpen={isRejectModalOpen}
            onClose={() => setIsRejectModalOpen(false)}
            caseId={currentCase.caseId}
            onConfirmReject={handleConfirmReject}
          />

          <SanctionSuccessModal
            isOpen={isSanctionSuccessModalOpen}
            onClose={() => setIsSanctionSuccessModalOpen(false)}
            loanCase={{
              case_id: currentCase.caseId,
              borrower_name: currentCase.borrowerName,
              loan_amount_inr: currentCase.loanFacilityRequested,
              ltv_percent: Number(((currentCase.loanFacilityRequested / currentCase.modelIndicativeValue) * 100).toFixed(1)),
              indicative_value_inr: currentCase.modelIndicativeValue,
              locality: currentCase.propertyProfile.location,
            } as any}
            onViewAuditTrail={() => setCurrentView('audit_logs')}
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
