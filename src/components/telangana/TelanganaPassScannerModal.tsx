import React, { useState, useEffect } from 'react';
import { 
  X, 
  QrCode, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  ShieldCheck, 
  User, 
  MapPin, 
  Building2,
  Calendar,
  Check,
  RefreshCw,
  Search
} from 'lucide-react';
import { TelanganaTravelPassData } from '../../types/telangana';

interface TelanganaPassScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPassId?: string;
  onPassUpdated?: (updatedPass: TelanganaTravelPassData) => void;
}

export const TelanganaPassScannerModal: React.FC<TelanganaPassScannerModalProps> = ({
  isOpen,
  onClose,
  initialPassId = 'TS-820194',
  onPassUpdated
}) => {
  const [passIdInput, setPassIdInput] = useState(initialPassId);
  const [passData, setPassData] = useState<TelanganaTravelPassData | null>(null);
  const [loading, setLoading] = useState(false);
  const [verifyingAction, setVerifyingAction] = useState<string | null>(null);
  const [actionFeedback, setActionFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    if (isOpen && initialPassId) {
      setPassIdInput(initialPassId);
      fetchPass(initialPassId);
    }
  }, [isOpen, initialPassId]);

  const fetchPass = async (id: string) => {
    setLoading(true);
    setActionFeedback(null);
    try {
      const res = await fetch(`/api/telangana/passes/${id.trim()}`);
      if (res.ok) {
        const data = await res.json();
        setPassData(data);
      } else {
        setPassData(null);
        setActionFeedback({ type: 'error', message: `Pass ${id} not found in verified registry.` });
      }
    } catch (e) {
      setActionFeedback({ type: 'error', message: 'Failed to communicate with Telangana verification gateway.' });
    } finally {
      setLoading(false);
    }
  };

  const handleMarkUsed = async (attractionId: string, attractionName: string) => {
    if (!passData) return;
    setVerifyingAction(attractionId);
    setActionFeedback(null);

    try {
      const res = await fetch(`/api/telangana/passes/${passData.passId}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'mark_attraction_used',
          attractionId,
          staffId: 'TS-STAFF-GATE-01'
        })
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setPassData(json.pass);
        setActionFeedback({
          type: 'success',
          message: `Admission successfully verified for ${attractionName}. Traveler admitted.`
        });
        if (onPassUpdated) {
          onPassUpdated(json.pass);
        }
      } else {
        setActionFeedback({
          type: 'error',
          message: json.error || 'Failed to mark attraction as visited.'
        });
      }
    } catch (e) {
      setActionFeedback({ type: 'error', message: 'Network error during gate verification.' });
    } finally {
      setVerifyingAction(null);
    }
  };

  if (!isOpen) return null;

  const totalAttractions = passData?.attractions?.length || 0;
  const visitedAttractions = passData?.attractions?.filter(a => a.visited).length || 0;
  const remainingAttractions = totalAttractions - visitedAttractions;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in text-left">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-inner">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/60">
                  Telangana Tourism • Partner Gate Terminal
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Live Gateway
                </span>
              </div>
              <h2 className="text-xl font-bold font-serif text-white mt-1">
                Pass QR & Entry Verification
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search / Scan Bar */}
        <div className="p-4 sm:p-6 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={passIdInput}
              onChange={(e) => setPassIdInput(e.target.value.toUpperCase())}
              placeholder="Enter Pass ID (e.g. TS-820194)..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 uppercase"
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchPass(passIdInput)}
              disabled={loading || !passIdInput.trim()}
              className="px-5 py-2.5 bg-slate-900 hover:bg-amber-600 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <QrCode className="w-4 h-4" />
              )}
              <span>Verify Pass</span>
            </button>
            <button
              onClick={() => {
                setPassIdInput('TS-820194');
                fetchPass('TS-820194');
              }}
              className="px-3 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs rounded-xl transition"
              title="Load Demo Pass"
            >
              Demo
            </button>
          </div>
        </div>

        {/* Feedback Alert */}
        {actionFeedback && (
          <div className={`mx-6 mt-4 p-3.5 rounded-xl border text-xs font-semibold flex items-center gap-2.5 ${
            actionFeedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
              : 'bg-rose-50 text-rose-900 border-rose-200'
          }`}>
            {actionFeedback.type === 'success' ? (
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{actionFeedback.message}</span>
          </div>
        )}

        {/* Pass Details Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
          {passData ? (
            <>
              {/* Top Pass Status Strip */}
              <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold font-mono text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded">
                      {passData.passId}
                    </span>
                    <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                      passData.passStatus === 'ACTIVE'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : passData.passStatus === 'PARTIALLY_USED'
                        ? 'bg-blue-100 text-blue-800 border border-blue-300'
                        : 'bg-slate-200 text-slate-700'
                    }`}>
                      {passData.passStatus.replace('_', ' ')}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-1 flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-500" />
                    <span>{passData.travelerName}</span>
                    <span className="text-xs font-normal text-slate-500">
                      ({passData.travelersCount} Traveler{passData.travelersCount > 1 ? 's' : ''} • {passData.tripStyle} Style)
                    </span>
                  </h3>
                  <p className="text-xs text-slate-600 flex items-center gap-2 mt-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{passData.tripDates}</span>
                    <span className="text-slate-300">•</span>
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{passData.destinations.join(' ➔ ')}</span>
                  </p>
                </div>

                {/* Admission Stats Counter */}
                <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-amber-200/80 shrink-0">
                  <div className="text-center px-2">
                    <p className="text-[10px] uppercase font-bold text-slate-400">Admitted</p>
                    <p className="text-lg font-black text-emerald-600">{visitedAttractions}</p>
                  </div>
                  <div className="w-px h-8 bg-slate-200"></div>
                  <div className="text-center px-2">
                    <p className="text-[10px] uppercase font-bold text-slate-400">Remaining</p>
                    <p className="text-lg font-black text-amber-600">{remainingAttractions}</p>
                  </div>
                  <div className="w-px h-8 bg-slate-200"></div>
                  <div className="text-center px-2">
                    <p className="text-[10px] uppercase font-bold text-slate-400">Total Sights</p>
                    <p className="text-lg font-black text-slate-800">{totalAttractions}</p>
                  </div>
                </div>
              </div>

              {/* Verified Monuments & Gate Validation */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>Monuments & Attractions Included in Pass</span>
                  </h4>
                  <span className="text-[11px] text-slate-500 font-medium">
                    Tap &quot;Admit &amp; Mark Used&quot; at gate entry
                  </span>
                </div>

                <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl bg-white overflow-hidden shadow-xs">
                  {passData.attractions && passData.attractions.length > 0 ? (
                    passData.attractions.map((att) => (
                      <div
                        key={att.attractionId}
                        className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition ${
                          att.visited ? 'bg-slate-50/70' : 'hover:bg-amber-50/30'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-900">
                              {att.name}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded-md font-semibold bg-slate-100 text-slate-600">
                              {att.category}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded-md font-bold bg-amber-100 text-amber-800">
                              {att.ticketStatus}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                            <span>Entry Fee: ₹{att.entryFee} (Included)</span>
                            {att.visited && (
                              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Used on {att.visitedTimestamp}</span>
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Action: Mark Used */}
                        <div className="shrink-0">
                          {att.visited ? (
                            <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-xs bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                              <CheckCircle className="w-4 h-4 text-emerald-600" />
                              <span>Entry Used</span>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleMarkUsed(att.attractionId, att.name)}
                              disabled={verifyingAction === att.attractionId}
                              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow-xs disabled:opacity-50"
                            >
                              {verifyingAction === att.attractionId ? (
                                <>
                                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                  <span>Validating...</span>
                                </>
                              ) : (
                                <>
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Admit & Mark Used</span>
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center text-sm text-slate-500">
                      No attractions attached to this pass.
                    </div>
                  )}
                </div>
              </div>

              {/* Linked Multimodal Transit & Stays */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Linked Transit & Chauffeur
                  </p>
                  <p className="text-xs font-bold text-slate-900 mt-1">
                    {passData.transport?.segments?.[0]?.mode || 'Multimodal Regional Transit'}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    PNR / Ref: {passData.transport?.segments?.[0]?.pnr || 'TS-RAIL-VERIFIED'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Verified Stay Accommodations
                  </p>
                  <p className="text-xs font-bold text-slate-900 mt-1">
                    {passData.stay?.[0]?.name || 'Haritha Heritage Property'}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Ref: {passData.stay?.[0]?.bookingRef || 'HOTEL-TS-981'}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <QrCode className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-700">
                No pass selected or pass not found.
              </p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Scan traveler QR code or enter a verified Telangana pass number like <strong className="text-slate-700">TS-820194</strong>.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Official Telangana Tourism Gateway • 100% Anti-Fraud Zero-Tamper Security</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
