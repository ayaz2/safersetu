import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Star,
  Users,
  Fuel,
  Gauge,
  Zap,
  CheckCircle2,
  Calendar,
  Compass,
  ArrowRight,
  Shield,
  Briefcase,
  Clock,
  FileText,
  AlertCircle,
  HelpCircle,
  Car,
  MapPin
} from 'lucide-react';
import { RentalVehicle, RentalMode } from '../../types';

interface RentalDetailModalProps {
  vehicle: RentalVehicle | null;
  onClose: () => void;
  onBookNow: (vehicle: RentalVehicle, mode: RentalMode) => void;
  initialMode?: RentalMode;
}

export const RentalDetailModal: React.FC<RentalDetailModalProps> = ({
  vehicle,
  onClose,
  onBookNow,
  initialMode = 'self_drive'
}) => {
  if (!vehicle) return null;

  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [selectedMode, setSelectedMode] = useState<RentalMode>(initialMode);
  const [calculatedDays, setCalculatedDays] = useState(3);

  // Price calculations
  let dailyRate = vehicle.pricePerDaySelfDrive;
  if (selectedMode === 'with_driver') {
    dailyRate = vehicle.pricePerDayChauffeur || (vehicle.pricePerDaySelfDrive + 800);
  } else if (selectedMode === 'driver_storyteller') {
    dailyRate = vehicle.pricePerDayStoryteller || (vehicle.pricePerDaySelfDrive + 1500);
  }

  const subtotal = dailyRate * calculatedDays;
  const taxes = Math.round(subtotal * 0.05); // 5% GST
  const deposit = selectedMode === 'driver_storyteller' ? 0 : vehicle.securityDeposit;
  const grandTotal = subtotal + taxes + deposit;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div
        id="rental-detail-modal"
        className="bg-white w-full max-w-4xl rounded-3xl border border-slate-200 shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col text-left"
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 shrink-0">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-slate-900 text-white">
              {vehicle.category.replace('_', ' ')}
            </span>
            <h2 className="font-serif font-bold text-xl sm:text-2xl text-slate-950">
              {vehicle.name}
            </h2>
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">
              ({vehicle.modelYear})
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-200/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          {/* Gallery & Quick Overview */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Gallery Column */}
            <div className="md:col-span-7 space-y-3">
              <div className="aspect-[16/10] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/80 shadow-xs relative">
                <img
                  src={vehicle.images[activeImgIndex] || vehicle.images[0]}
                  alt={vehicle.name}
                  className="w-full h-full object-cover"
                />

                {vehicle.verified && (
                  <div className="absolute top-3 left-3 bg-emerald-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-xs">
                    <ShieldCheck className="w-4 h-4" />
                    <span>SafarSetu Verified Fleet</span>
                  </div>
                )}
              </div>

              {/* Thumbnail Selector if multiple */}
              {vehicle.images.length > 1 && (
                <div className="flex items-center gap-2">
                  {vehicle.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImgIndex(idx)}
                      className={`w-16 h-12 rounded-lg overflow-hidden border-2 transition ${
                        activeImgIndex === idx ? 'border-slate-900 scale-105' : 'border-slate-200 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="thumb" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Specs & Provider Summary */}
            <div className="md:col-span-5 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-orange-600" />
                    <span>{vehicle.city} Corridor</span>
                  </span>
                  <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-lg text-xs font-bold text-amber-900">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{vehicle.providerRating.toFixed(1)}</span>
                    <span className="text-slate-500 font-normal">({vehicle.reviewsCount} reviews)</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs space-y-2">
                  <div className="font-bold text-slate-900">Provider Credentials</div>
                  <div className="text-slate-700 font-medium">{vehicle.providerName}</div>
                  <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{vehicle.verificationBadgeText}</span>
                  </div>
                </div>

                {/* Pickup Hubs */}
                <div className="space-y-1.5 text-xs">
                  <span className="font-bold text-slate-700 block">Available Pickup Hubs:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {vehicle.pickupHubs.map((hub, i) => (
                      <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[11px] font-medium">
                        {hub}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Mode Selection Options */}
              <div className="space-y-2 pt-3 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-800">
                  Select Rental Mode:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {vehicle.allowedModes.includes('self_drive') && (
                    <button
                      onClick={() => setSelectedMode('self_drive')}
                      className={`p-2.5 rounded-xl border text-left text-xs transition ${
                        selectedMode === 'self_drive'
                          ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <div className="font-bold">Self-Drive</div>
                      <div className={`text-[10px] ${selectedMode === 'self_drive' ? 'text-slate-300' : 'text-slate-500'}`}>
                        ₹{vehicle.pricePerDaySelfDrive.toLocaleString('en-IN')}/day
                      </div>
                    </button>
                  )}

                  {vehicle.allowedModes.includes('with_driver') && (
                    <button
                      onClick={() => setSelectedMode('with_driver')}
                      className={`p-2.5 rounded-xl border text-left text-xs transition ${
                        selectedMode === 'with_driver'
                          ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <div className="font-bold">With Driver</div>
                      <div className={`text-[10px] ${selectedMode === 'with_driver' ? 'text-slate-300' : 'text-slate-500'}`}>
                        ₹{(vehicle.pricePerDayChauffeur || vehicle.pricePerDaySelfDrive + 800).toLocaleString('en-IN')}/day
                      </div>
                    </button>
                  )}

                  {vehicle.allowedModes.includes('driver_storyteller') && (
                    <button
                      onClick={() => setSelectedMode('driver_storyteller')}
                      className={`p-2.5 rounded-xl border text-left text-xs transition ${
                        selectedMode === 'driver_storyteller'
                          ? 'border-orange-600 bg-orange-600 text-white shadow-xs'
                          : 'border-orange-200 bg-orange-50/50 hover:bg-orange-50 text-orange-950'
                      }`}
                    >
                      <div className="font-bold">+ Storyteller</div>
                      <div className={`text-[10px] ${selectedMode === 'driver_storyteller' ? 'text-orange-100' : 'text-orange-700'}`}>
                        ₹{(vehicle.pricePerDayStoryteller || vehicle.pricePerDaySelfDrive + 1500).toLocaleString('en-IN')}/day
                      </div>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Full Specifications Grid */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Vehicle Specifications & Amenities
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
                <span className="text-slate-500 block text-[11px]">Seating Capacity</span>
                <span className="font-bold text-slate-900 text-sm">{vehicle.seats} Passengers</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
                <span className="text-slate-500 block text-[11px]">Transmission</span>
                <span className="font-bold text-slate-900 text-sm capitalize">{vehicle.transmission}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
                <span className="text-slate-500 block text-[11px]">Fuel / Energy Type</span>
                <span className="font-bold text-slate-900 text-sm capitalize">{vehicle.fuelType}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
                <span className="text-slate-500 block text-[11px]">Fuel Efficiency / Range</span>
                <span className="font-bold text-slate-900 text-sm">{vehicle.mileageOrRange}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
                <span className="text-slate-500 block text-[11px]">Air Conditioning</span>
                <span className="font-bold text-slate-900 text-sm">{vehicle.ac ? 'Dual Zone Climate AC' : 'None'}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
                <span className="text-slate-500 block text-[11px]">Safety Airbags</span>
                <span className="font-bold text-slate-900 text-sm">{vehicle.airbags} Airbags + ABS</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
                <span className="text-slate-500 block text-[11px]">Luggage Capacity</span>
                <span className="font-bold text-slate-900 text-sm">~{vehicle.bootSpaceBags} Large Bags</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
                <span className="text-slate-500 block text-[11px]">Interstate Permit</span>
                <span className="font-bold text-slate-900 text-sm">
                  {vehicle.interstatePermitsIncluded ? 'All-India Commercial' : 'State Corridor'}
                </span>
              </div>
            </div>

            {/* Features list */}
            <div className="flex flex-wrap gap-2 pt-2">
              {vehicle.features.map((feat, i) => (
                <span key={i} className="px-3 py-1 bg-slate-100 text-slate-800 rounded-lg text-xs font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{feat}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Transparent Policies */}
          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Transparent Rental Policies
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70 space-y-1">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-orange-600" />
                  <span>Driving License & Age Requirement</span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Minimum age {vehicle.minAge}+ years. {vehicle.licenseRequirement}. Original document physical inspection during handover.
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70 space-y-1">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-emerald-600" />
                  <span>Security Deposit Terms</span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  {deposit === 0 ? (
                    <strong className="text-emerald-700">₹0 Zero Deposit required for Storyteller Chauffeur rides.</strong>
                  ) : (
                    `₹${deposit.toLocaleString('en-IN')} pre-authorized via UPI / Card. Released immediately upon vehicle drop-off inspection.`
                  )}
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70 space-y-1">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Fuel className="w-4 h-4 text-slate-700" />
                  <span>Fuel & Mileage Policy</span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  {vehicle.kmPolicy}. {vehicle.fuelPolicy}. Fastag toll deductions settled automatically at trip conclusion.
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70 space-y-1">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span>Cancellation & 24x7 Roadside Support</span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  100% full refund if cancelled up to 24 hours prior to pickup. 24x7 Pan-India breakdown assistance helpline included.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Sticky Footer CTA */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50/90 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-left w-full sm:w-auto">
            <div className="text-xs text-slate-500">
              Estimated for {calculatedDays} days ({selectedMode.replace('_', ' ')})
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-slate-950">
                ₹{grandTotal.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-slate-500">
                (incl. ₹{taxes.toLocaleString('en-IN')} GST {deposit > 0 ? `+ ₹${deposit.toLocaleString('en-IN')} refundable dep.` : ''})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="w-1/2 sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-xs text-slate-700 hover:bg-slate-100 transition"
            >
              Close
            </button>
            <button
              id="btn-proceed-to-book"
              onClick={() => onBookNow(vehicle, selectedMode)}
              className="w-1/2 sm:w-auto px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-sm"
            >
              <span>Proceed to Book</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
