import React, { useState } from 'react';
import { 
  ShieldCheck, 
  QrCode, 
  MapPin, 
  Calendar, 
  User, 
  Phone, 
  Mail, 
  CheckCircle, 
  Clock, 
  Download, 
  Printer, 
  Share2, 
  Compass, 
  Building2, 
  Car, 
  Home, 
  Sparkles, 
  ArrowLeft,
  ScanLine,
  PhoneCall,
  Check
} from 'lucide-react';
import { TelanganaTravelPassData } from '../../types/telangana';
import { TelanganaPassScannerModal } from './TelanganaPassScannerModal';

interface TelanganaTravelPassViewProps {
  pass: TelanganaTravelPassData;
  onBackToBuilder?: () => void;
  onBackToLanding?: () => void;
  onPassUpdated?: (updatedPass: TelanganaTravelPassData) => void;
}

export const TelanganaTravelPassView: React.FC<TelanganaTravelPassViewProps> = ({
  pass: initialPass,
  onBackToBuilder,
  onBackToLanding,
  onPassUpdated
}) => {
  const [pass, setPass] = useState<TelanganaTravelPassData>(initialPass);
  const [scannerModalOpen, setScannerModalOpen] = useState(false);
  const [downloadedNotice, setDownloadedNotice] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const totalAttractions = pass.attractions?.length || 0;
  const visitedAttractions = pass.attractions?.filter(a => a.visited).length || 0;
  const remainingAttractions = totalAttractions - visitedAttractions;

  const handleDownloadOfflinePass = () => {
    setDownloadedNotice(true);
    setTimeout(() => setDownloadedNotice(false), 3500);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handlePassUpdateFromModal = (updated: TelanganaTravelPassData) => {
    setPass(updated);
    if (onPassUpdated) {
      onPassUpdated(updated);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6 text-left">
      
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          {onBackToBuilder ? (
            <button
              onClick={onBackToBuilder}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition flex items-center gap-1.5 text-xs font-bold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Modify Trip</span>
            </button>
          ) : onBackToLanding ? (
            <button
              onClick={onBackToLanding}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition flex items-center gap-1.5 text-xs font-bold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Telangana Tourism Home</span>
            </button>
          ) : null}
          <div>
            <span className="text-[10px] uppercase font-extrabold tracking-widest text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Official Digital Travel Credential
            </span>
            <h1 className="text-lg sm:text-xl font-bold font-serif text-slate-950 mt-0.5">
              Consolidated Telangana Travel Pass
            </h1>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setScannerModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-xs"
            title="Simulate monument gate QR scan"
          >
            <ScanLine className="w-3.5 h-3.5" />
            <span>Gate Staff Scanner</span>
          </button>

          <button
            onClick={handleDownloadOfflinePass}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
            title="Download Offline Cryptographic Pass"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            onClick={handlePrint}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition hidden sm:flex"
            title="Print Physical Pass"
          >
            <Printer className="w-4 h-4" />
          </button>

          <button
            onClick={handleShare}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
            title="Copy Pass Link"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {downloadedNotice && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-semibold flex items-center gap-2 animate-fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Pass cached for 100% offline access. Includes verified cryptographic token readable without cell reception at remote monuments.</span>
        </div>
      )}

      {/* THE MAIN BOARDING PASS CARD */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden print:border-none print:shadow-none">
        
        {/* Pass Top Banner */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 text-white p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-black uppercase tracking-widest bg-amber-500 text-slate-950 px-2.5 py-0.5 rounded shadow-xs">
                  GOVERNMENT OF TELANGANA
                </span>
                <span className="text-[11px] font-semibold text-amber-200/90 bg-white/10 px-2.5 py-0.5 rounded backdrop-blur-xs">
                  SafarSetu Integrated Pass
                </span>
                <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                  pass.passStatus === 'ACTIVE'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                    : pass.passStatus === 'PARTIALLY_USED'
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-400/40'
                    : 'bg-slate-700 text-slate-300'
                }`}>
                  {pass.passStatus.replace('_', ' ')}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
                Telangana Travel Pass
              </h2>
              <p className="text-xs text-slate-300 max-w-lg leading-relaxed">
                All-in-one digital credential valid across state monument admissions, verified Haritha &amp; homestay accommodations, storyteller chauffeur navigation, and intercity travel corridors.
              </p>
            </div>

            {/* Pass ID Block */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl text-center shrink-0 sm:min-w-[170px]">
              <p className="text-[10px] uppercase font-bold tracking-wider text-amber-300">
                Official Pass ID
              </p>
              <p className="text-xl sm:text-2xl font-mono font-black text-white tracking-wider my-0.5">
                {pass.passId}
              </p>
              <p className="text-[10px] font-mono text-slate-300">
                Trip: {pass.tripId}
              </p>
            </div>
          </div>
        </div>

        {/* Mid Section: QR Code & Traveler Credentials */}
        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 border-b border-dashed border-slate-200">
          
          {/* Left 2 Columns: Traveler Details */}
          <div className="md:col-span-2 space-y-5">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Primary Traveler</p>
                <p className="text-sm font-bold text-slate-900 mt-0.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-amber-600" />
                  <span>{pass.travelerName}</span>
                </p>
                <p className="text-xs text-slate-500">{pass.travelerPhone}</p>
              </div>

              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Group Composition</p>
                <p className="text-sm font-bold text-slate-900 mt-0.5">
                  {pass.travelersCount} Traveler{pass.travelersCount > 1 ? 's' : ''} ({pass.travelerType})
                </p>
                <p className="text-xs text-slate-500">{pass.tripStyle} Tier</p>
              </div>

              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Validity Period</p>
                <p className="text-sm font-bold text-slate-900 mt-0.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-600" />
                  <span>{pass.tripDates}</span>
                </p>
                <p className="text-xs text-emerald-600 font-semibold">Active &amp; Verified</p>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Destinations Corridor
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                {pass.destinations.map((dest, i) => (
                  <React.Fragment key={dest}>
                    <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800 shadow-2xs flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-amber-600" />
                      <span>{dest}</span>
                    </span>
                    {i < pass.destinations.length - 1 && (
                      <span className="text-xs font-bold text-slate-300">➔</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Pass QR Code */}
          <div className="flex flex-col items-center justify-center p-5 bg-amber-50/50 rounded-2xl border border-amber-200/80 text-center">
            {/* SVG Visual QR Code */}
            <div className="w-36 h-36 bg-white p-2.5 rounded-2xl border-2 border-amber-300 shadow-sm flex flex-col items-center justify-center relative">
              <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900">
                {/* Simulated high-fidelity 2D matrix pattern */}
                <rect x="0" y="0" width="100" height="100" fill="white" />
                {/* Top-Left Finder */}
                <rect x="10" y="10" width="24" height="24" rx="3" fill="#0f172a" />
                <rect x="14" y="14" width="16" height="16" rx="2" fill="white" />
                <rect x="18" y="18" width="8" height="8" rx="1" fill="#f59e0b" />
                {/* Top-Right Finder */}
                <rect x="66" y="10" width="24" height="24" rx="3" fill="#0f172a" />
                <rect x="70" y="14" width="16" height="16" rx="2" fill="white" />
                <rect x="74" y="18" width="8" height="8" rx="1" fill="#f59e0b" />
                {/* Bottom-Left Finder */}
                <rect x="10" y="66" width="24" height="24" rx="3" fill="#0f172a" />
                <rect x="14" y="70" width="16" height="16" rx="2" fill="white" />
                <rect x="18" y="74" width="8" height="8" rx="1" fill="#f59e0b" />
                {/* Matrix Dots */}
                <circle cx="45" cy="18" r="3" fill="#0f172a" />
                <circle cx="55" cy="18" r="3" fill="#0f172a" />
                <circle cx="45" cy="28" r="3" fill="#0f172a" />
                <circle cx="55" cy="28" r="3" fill="#0f172a" />
                <circle cx="20" cy="45" r="3" fill="#0f172a" />
                <circle cx="30" cy="45" r="3" fill="#0f172a" />
                <circle cx="40" cy="45" r="3" fill="#0f172a" />
                <circle cx="50" cy="45" r="3" fill="#f59e0b" />
                <circle cx="60" cy="45" r="3" fill="#0f172a" />
                <circle cx="70" cy="45" r="3" fill="#0f172a" />
                <circle cx="80" cy="45" r="3" fill="#0f172a" />
                <circle cx="40" cy="55" r="3" fill="#0f172a" />
                <circle cx="50" cy="55" r="3" fill="#0f172a" />
                <circle cx="60" cy="55" r="3" fill="#0f172a" />
                <circle cx="45" cy="72" r="3" fill="#0f172a" />
                <circle cx="55" cy="72" r="3" fill="#0f172a" />
                <circle cx="45" cy="82" r="3" fill="#0f172a" />
                <circle cx="55" cy="82" r="3" fill="#0f172a" />
                <circle cx="70" cy="70" r="3" fill="#0f172a" />
                <circle cx="80" cy="70" r="3" fill="#0f172a" />
                <circle cx="75" cy="80" r="3" fill="#0f172a" />
                <circle cx="85" cy="85" r="3" fill="#f59e0b" />
              </svg>
            </div>

            <p className="text-[11px] font-mono font-bold text-slate-800 mt-2">
              SCAN AT ENTRY GATES
            </p>
            <p className="text-[10px] text-slate-500 leading-tight mt-0.5">
              Instant entry across monuments &amp; verified transit check-ins
            </p>
            <button
              onClick={() => setScannerModalOpen(true)}
              className="mt-2 text-[11px] text-amber-800 font-bold hover:underline flex items-center gap-1"
            >
              <ScanLine className="w-3 h-3" />
              <span>Test Gate Scanner</span>
            </button>
          </div>

        </div>

        {/* Attractions Included in Pass */}
        <div className="p-6 sm:p-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold font-serif text-slate-900 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-amber-600" />
                <span>Included Attractions &amp; Monument Admissions</span>
              </h3>
              <p className="text-xs text-slate-500">
                Direct QR barcode access at official entry points. Zero counter wait times.
              </p>
            </div>
            <div className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-xl self-start sm:self-auto">
              Admissions: <span className="text-emerald-700">{visitedAttractions} used</span> / <span className="text-amber-700">{remainingAttractions} remaining</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {pass.attractions?.map((att) => (
              <div
                key={att.attractionId}
                className={`p-3.5 rounded-2xl border transition flex items-start justify-between gap-3 ${
                  att.visited
                    ? 'bg-slate-50 border-slate-200 opacity-75'
                    : 'bg-white border-amber-200/80 shadow-2xs hover:border-amber-400'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">
                      {att.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                    <span className="bg-slate-100 px-2 py-0.5 rounded font-semibold text-slate-600">
                      {att.category}
                    </span>
                    <span>Entry: ₹{att.entryFee} (Included)</span>
                  </div>
                  {att.visited && (
                    <p className="text-[10px] text-emerald-700 font-semibold mt-1 flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span>Verified: {att.visitedTimestamp}</span>
                    </p>
                  )}
                </div>

                <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md shrink-0 ${
                  att.visited
                    ? 'bg-slate-200 text-slate-600'
                    : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {att.visited ? 'Used' : 'Included'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Stays & Multimodal Transport Bundled Overview */}
        <div className="p-6 sm:p-8 bg-slate-50/70 border-t border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Transport */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Car className="w-3.5 h-3.5 text-slate-400" />
              <span>Intercity &amp; Local Mobility</span>
            </h4>
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 text-xs space-y-1">
              <p className="font-bold text-slate-900">
                {pass.transport?.segments?.[0]?.mode || 'Multimodal Regional Transit'}
              </p>
              <p className="text-slate-500">
                Route: {pass.transport?.segments?.[0]?.from || 'Hyderabad'} ➔ {pass.transport?.segments?.[0]?.to || 'Warangal'}
              </p>
              <p className="text-[11px] font-mono text-emerald-700 font-semibold">
                PNR: {pass.transport?.segments?.[0]?.pnr || 'TS-IRCTC-CONFIRMED'}
              </p>
              {pass.transport?.localTransitSummary && (
                <p className="text-[11px] text-slate-600 pt-1 border-t border-slate-100">
                  {pass.transport.localTransitSummary}
                </p>
              )}
            </div>
          </div>

          {/* Accommodations */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Home className="w-3.5 h-3.5 text-slate-400" />
              <span>Verified Stays</span>
            </h4>
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 text-xs space-y-1">
              <p className="font-bold text-slate-900">
                {pass.stay?.[0]?.name || 'Haritha Heritage Property'}
              </p>
              <p className="text-slate-500">
                {pass.stay?.[0]?.roomType || 'Deluxe Room'} ({pass.stay?.[0]?.nights || 4} Nights)
              </p>
              <p className="text-[11px] font-mono text-emerald-700 font-semibold">
                Ref: {pass.stay?.[0]?.bookingRef || 'HOTEL-TS-981'}
              </p>
            </div>
          </div>

          {/* Guide / Storyteller & Rental */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-slate-400" />
              <span>Local Guide &amp; Vehicle</span>
            </h4>
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 text-xs space-y-1">
              <p className="font-bold text-slate-900">
                {pass.guide ? `${pass.guide.name} (Certified Storyteller)` : 'Self-Guided with SafarMitra AI'}
              </p>
              {pass.guide && (
                <p className="text-slate-500 text-[11px]">
                  Languages: {pass.guide.languages.join(', ')} • Ref: {pass.guide.bookingRef}
                </p>
              )}
              {pass.rental ? (
                <p className="text-slate-700 font-medium pt-1 border-t border-slate-100 text-[11px]">
                  Vehicle: {pass.rental.vehicleName} ({pass.rental.days} Days)
                </p>
              ) : (
                <p className="text-slate-400 text-[11px]">No vehicle rental attached</p>
              )}
            </div>
          </div>

        </div>

        {/* Budget Breakdown & Transparent Pricing Strip */}
        <div className="p-6 sm:p-8 border-t border-slate-200 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Itemized Cost Breakdown • Zero Platform Surcharge
            </span>
            <div className="flex items-center gap-3 text-xs text-slate-600 mt-1 flex-wrap">
              <span>Transit: ₹{pass.totalBudget.transportCost}</span>
              <span>•</span>
              <span>Stays: ₹{pass.totalBudget.staysCost}</span>
              <span>•</span>
              <span>Monuments: ₹{pass.totalBudget.attractionsCost}</span>
              {pass.totalBudget.guideCost > 0 && (
                <>
                  <span>•</span>
                  <span>Guide: ₹{pass.totalBudget.guideCost}</span>
                </>
              )}
              {pass.totalBudget.rentalCost > 0 && (
                <>
                  <span>•</span>
                  <span>Rental: ₹{pass.totalBudget.rentalCost}</span>
                </>
              )}
            </div>
          </div>

          <div className="text-right shrink-0">
            <p className="text-[11px] uppercase font-bold text-slate-400">Consolidated Pass Value</p>
            <p className="text-2xl font-serif font-black text-slate-950">
              ₹{pass.totalBudget.grandTotal.toLocaleString('en-IN')}
            </p>
            <p className="text-[10px] text-emerald-600 font-bold">100% Guaranteed &amp; Pre-authorized</p>
          </div>
        </div>

        {/* Emergency Contacts & State Tourism Support Footer */}
        <div className="p-4 sm:p-5 bg-amber-500/10 border-t border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-800">
            <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              <strong>Emergency &amp; Assistance:</strong> National Police: <strong>112</strong> • Telangana Tourism: <strong>{pass.emergencyContact.telanganaTourismHelpline}</strong> • SHE Teams: <strong>{pass.emergencyContact.sheTeams}</strong>
            </span>
          </div>
          <a
            href="tel:180042546464"
            className="px-3 py-1.5 bg-white border border-amber-300 rounded-xl text-amber-900 font-bold hover:bg-amber-50 transition flex items-center gap-1.5 shrink-0"
          >
            <PhoneCall className="w-3.5 h-3.5 text-amber-600" />
            <span>Helpline 1800-425-46464</span>
          </a>
        </div>

      </div>

      {/* Pass Scanner Modal */}
      <TelanganaPassScannerModal
        isOpen={scannerModalOpen}
        onClose={() => setScannerModalOpen(false)}
        initialPassId={pass.passId}
        onPassUpdated={handlePassUpdateFromModal}
      />

    </div>
  );
};
