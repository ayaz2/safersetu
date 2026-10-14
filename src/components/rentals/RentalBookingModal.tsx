import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  Car,
  Users,
  CreditCard,
  QrCode,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  FileText,
  Phone,
  Mail,
  User,
  Shield,
  Download,
  Check
} from 'lucide-react';
import { RentalVehicle, RentalMode, RentalBooking } from '../../types';

interface RentalBookingModalProps {
  vehicle: RentalVehicle;
  initialMode: RentalMode;
  initialPickupDate: string;
  initialReturnDate: string;
  onClose: () => void;
  onBookingSuccess: (booking: RentalBooking) => void;
}

export const RentalBookingModal: React.FC<RentalBookingModalProps> = ({
  vehicle,
  initialMode,
  initialPickupDate,
  initialReturnDate,
  onClose,
  onBookingSuccess
}) => {
  // Step flow: 1: Trip Specs, 2: Pickup Hub & Traveler Details, 3: Review & Payment, 4: Confirmed Voucher
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form states
  const [rentalMode, setRentalMode] = useState<RentalMode>(initialMode);
  const [pickupDate, setPickupDate] = useState(initialPickupDate || new Date().toISOString().split('T')[0]);
  const [pickupTime, setPickupTime] = useState('10:00 AM');
  
  // Default return date: 3 days later if not provided
  const getDefaultReturnDate = () => {
    if (initialReturnDate) return initialReturnDate;
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  };
  const [returnDate, setReturnDate] = useState(getDefaultReturnDate());
  const [returnTime, setReturnTime] = useState('10:00 AM');

  const [pickupLocation, setPickupLocation] = useState(vehicle.pickupHubs[0] || 'Airport Terminal');
  const [dropLocation, setDropLocation] = useState(vehicle.pickupHubs[0] || 'Airport Terminal');
  const [needsDoorstepDelivery, setNeedsDoorstepDelivery] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState('');

  // Traveler info
  const [travelerName, setTravelerName] = useState('');
  const [travelerPhone, setTravelerPhone] = useState('');
  const [travelerEmail, setTravelerEmail] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARD' | 'PAY_AT_PICKUP'>('UPI');

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<RentalBooking | null>(null);

  // Calculate rental duration in days
  const calculateDays = () => {
    try {
      const d1 = new Date(pickupDate).getTime();
      const d2 = new Date(returnDate).getTime();
      if (isNaN(d1) || isNaN(d2)) return 1;
      const days = Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24));
      return Math.max(1, days);
    } catch {
      return 1;
    }
  };

  const days = calculateDays();

  // Pricing calculation
  let dailyRate = vehicle.pricePerDaySelfDrive;
  let driverAllowance = 0;
  let storytellerFee = 0;
  let refundableDeposit = vehicle.securityDeposit;

  if (rentalMode === 'with_driver') {
    dailyRate = vehicle.pricePerDayChauffeur || (vehicle.pricePerDaySelfDrive + 800);
    driverAllowance = 800 * days;
    refundableDeposit = Math.round(vehicle.securityDeposit * 0.5);
  } else if (rentalMode === 'driver_storyteller') {
    dailyRate = vehicle.pricePerDayStoryteller || (vehicle.pricePerDaySelfDrive + 1500);
    driverAllowance = 800 * days;
    storytellerFee = 700 * days;
    refundableDeposit = 0; // Zero deposit
  }

  const baseRental = vehicle.pricePerDaySelfDrive * days;
  const deliveryFee = needsDoorstepDelivery ? 350 : 0;
  const subtotal = (dailyRate * days) + deliveryFee;
  const taxes = Math.round(subtotal * 0.05); // 5% GST
  const grandTotal = subtotal + taxes + refundableDeposit;

  const handleProceedToDetails = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!pickupDate || !returnDate) {
      setErrorMessage('Please select valid pickup and return dates.');
      return;
    }
    setStep(2);
  };

  const handleProceedToReview = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!travelerName.trim()) {
      setErrorMessage('Please enter the primary traveler name.');
      return;
    }
    if (!travelerPhone.trim() || travelerPhone.length < 10) {
      setErrorMessage('Please provide a valid 10-digit mobile number for pickup coordination.');
      return;
    }
    if (rentalMode === 'self_drive' && !licenseNumber.trim()) {
      setErrorMessage('Please provide your Driving License number for self-drive verification.');
      return;
    }
    setStep(3);
  };

  const handleConfirmBooking = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/rentals/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehicleId: vehicle.id,
          rentalMode,
          city: vehicle.city,
          pickupLocation: needsDoorstepDelivery ? `Doorstep Delivery: ${deliveryAddress}` : pickupLocation,
          dropLocation: needsDoorstepDelivery ? `Doorstep Pickup: ${deliveryAddress}` : dropLocation,
          pickupDate,
          pickupTime,
          returnDate,
          returnTime,
          travelerName,
          travelerPhone,
          travelerEmail: travelerEmail || `${travelerName.toLowerCase().replace(/\s+/g, '')}@safarsetu.in`,
          licenseNumber: licenseNumber || 'CHAUFFEUR-ESCORTED',
          paymentMethod: paymentMethod === 'UPI' ? 'UPI (Google Pay / PhonePe)' : paymentMethod === 'CARD' ? 'Credit / Debit Card' : 'Pay at Handover',
          needsDoorstepDelivery
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to complete booking. Please retry.');
      }

      setConfirmedBooking(data.booking);
      setStep(4);
      onBookingSuccess(data.booking);
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred while confirming your rental.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-fade-in text-left">
      <div
        id="rental-booking-modal"
        className="bg-white w-full max-w-2xl rounded-3xl border border-slate-200 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
      >
        {/* Modal Top Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/90 shrink-0">
          <div>
            <span className="text-[11px] font-bold text-orange-700 uppercase tracking-wider block">
              SafarSetu Guaranteed Booking
            </span>
            <h2 className="font-serif font-bold text-xl text-slate-950">
              {step === 4 ? 'Booking Confirmed!' : `Reserve ${vehicle.name}`}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-200/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator (Steps 1-3) */}
        {step < 4 && (
          <div className="px-5 py-2.5 bg-slate-100/70 border-b border-slate-200/70 flex items-center justify-between text-xs font-bold text-slate-600">
            <div className={`flex items-center gap-1.5 ${step >= 1 ? 'text-slate-950' : 'text-slate-400'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 1 ? 'bg-slate-950 text-white' : 'bg-slate-300'}`}>
                1
              </span>
              <span>Trip & Dates</span>
            </div>
            <div className="w-6 h-px bg-slate-300" />
            <div className={`flex items-center gap-1.5 ${step >= 2 ? 'text-slate-950' : 'text-slate-400'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 2 ? 'bg-slate-950 text-white' : 'bg-slate-300'}`}>
                2
              </span>
              <span>Traveler Info</span>
            </div>
            <div className="w-6 h-px bg-slate-300" />
            <div className={`flex items-center gap-1.5 ${step >= 3 ? 'text-slate-950' : 'text-slate-400'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 3 ? 'bg-slate-950 text-white' : 'bg-slate-300'}`}>
                3
              </span>
              <span>Payment</span>
            </div>
          </div>
        )}

        {/* Error Notification */}
        {errorMessage && (
          <div className="mx-5 mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
          {/* STEP 1: DATES & RENTAL MODE */}
          {step === 1 && (
            <form onSubmit={handleProceedToDetails} className="space-y-4 text-xs">
              {/* Vehicle preview chip */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-3">
                <img src={vehicle.images[0]} alt="vehicle" className="w-16 h-12 object-cover rounded-xl" />
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{vehicle.name}</h4>
                  <div className="text-[11px] text-slate-500">
                    {vehicle.city} Corridor • {vehicle.seats} Seats • {vehicle.fuelType}
                  </div>
                </div>
              </div>

              {/* Rental Mode Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Select Rental Experience:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {vehicle.allowedModes.includes('self_drive') && (
                    <button
                      type="button"
                      onClick={() => setRentalMode('self_drive')}
                      className={`p-3 rounded-xl border text-left transition ${
                        rentalMode === 'self_drive'
                          ? 'border-slate-950 bg-slate-900 text-white shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <div className="font-bold">Self-Drive</div>
                      <div className={`text-[10px] ${rentalMode === 'self_drive' ? 'text-slate-300' : 'text-slate-500'}`}>
                        Drive yourself • ₹{vehicle.pricePerDaySelfDrive.toLocaleString('en-IN')}/day
                      </div>
                    </button>
                  )}

                  {vehicle.allowedModes.includes('with_driver') && (
                    <button
                      type="button"
                      onClick={() => setRentalMode('with_driver')}
                      className={`p-3 rounded-xl border text-left transition ${
                        rentalMode === 'with_driver'
                          ? 'border-slate-950 bg-slate-900 text-white shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <div className="font-bold">With Chauffeur</div>
                      <div className={`text-[10px] ${rentalMode === 'with_driver' ? 'text-slate-300' : 'text-slate-500'}`}>
                        Professional driver included
                      </div>
                    </button>
                  )}

                  {vehicle.allowedModes.includes('driver_storyteller') && (
                    <button
                      type="button"
                      onClick={() => setRentalMode('driver_storyteller')}
                      className={`p-3 rounded-xl border text-left transition ${
                        rentalMode === 'driver_storyteller'
                          ? 'border-orange-600 bg-orange-600 text-white shadow-xs'
                          : 'border-orange-200 bg-orange-50/50 hover:bg-orange-50 text-orange-950'
                      }`}
                    >
                      <div className="font-bold">+ Storyteller Chauffeur</div>
                      <div className={`text-[10px] ${rentalMode === 'driver_storyteller' ? 'text-orange-100' : 'text-orange-700'}`}>
                        Local stories & secret gems
                      </div>
                    </button>
                  )}
                </div>
              </div>

              {/* Dates and Times */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <label className="block text-[11px] font-bold text-slate-600 uppercase">
                    Pickup Date & Time
                  </label>
                  <input
                    type="date"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg font-semibold"
                    required
                  />
                  <select
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg font-semibold"
                  >
                    <option>08:00 AM</option>
                    <option>09:00 AM</option>
                    <option>10:00 AM</option>
                    <option>12:00 PM</option>
                    <option>02:00 PM</option>
                    <option>04:00 PM</option>
                    <option>06:00 PM</option>
                    <option>08:00 PM</option>
                  </select>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <label className="block text-[11px] font-bold text-slate-600 uppercase">
                    Return Date & Time
                  </label>
                  <input
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg font-semibold"
                    required
                  />
                  <select
                    value={returnTime}
                    onChange={(e) => setReturnTime(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg font-semibold"
                  >
                    <option>10:00 AM</option>
                    <option>12:00 PM</option>
                    <option>02:00 PM</option>
                    <option>04:00 PM</option>
                    <option>06:00 PM</option>
                    <option>08:00 PM</option>
                    <option>10:00 PM</option>
                  </select>
                </div>
              </div>

              {/* Calculated duration badge */}
              <div className="flex items-center justify-between p-3 bg-orange-50/70 border border-orange-200/80 rounded-xl">
                <span className="font-semibold text-orange-900">
                  Total Duration: <strong className="text-orange-950">{days} Rental Days</strong>
                </span>
                <span className="font-bold text-slate-900 text-sm">
                  ₹{(dailyRate * days).toLocaleString('en-IN')} base fare
                </span>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-xs"
                >
                  <span>Continue to Traveler Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: PICKUP HUB & TRAVELER DETAILS */}
          {step === 2 && (
            <form onSubmit={handleProceedToReview} className="space-y-4 text-xs">
              {/* Pickup & Return Hub Selection */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-800">
                  Pickup Location Hub:
                </label>
                <select
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900"
                >
                  {vehicle.pickupHubs.map((hub, i) => (
                    <option key={i} value={hub}>{hub}</option>
                  ))}
                </select>

                {/* Doorstep Delivery Toggle */}
                <label className="flex items-center gap-2 pt-1 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={needsDoorstepDelivery}
                    onChange={(e) => setNeedsDoorstepDelivery(e.target.checked)}
                    className="rounded text-slate-900 focus:ring-slate-900"
                  />
                  <span className="font-semibold text-slate-800">
                    Deliver directly to my hotel / residence (+₹350 flat concierge delivery)
                  </span>
                </label>

                {needsDoorstepDelivery && (
                  <input
                    type="text"
                    placeholder="Enter your hotel name, room or complete delivery address"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-medium mt-1"
                    required
                  />
                )}
              </div>

              {/* Traveler Details Form */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                  Primary Traveler Details
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Full Name (as on Gov ID) *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Ramesh Chandra"
                      value={travelerName}
                      onChange={(e) => setTravelerName(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      WhatsApp / Mobile Number *
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={travelerPhone}
                      onChange={(e) => setTravelerPhone(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Email Address (for voucher)
                    </label>
                    <input
                      type="email"
                      placeholder="traveler@example.com"
                      value={travelerEmail}
                      onChange={(e) => setTravelerEmail(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900"
                    />
                  </div>

                  {rentalMode === 'self_drive' ? (
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Indian Driving License / IDP No. *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. DL-0420180012345"
                        value={licenseNumber}
                        onChange={(e) => setLicenseNumber(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 uppercase"
                        required
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Driver Language Preference
                      </label>
                      <select className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900">
                        <option>English & Hindi (Fluent)</option>
                        <option>Local Regional Language + English</option>
                        <option>No Preference</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-xs text-slate-700 hover:bg-slate-100 transition flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-xs"
                >
                  <span>Review & Pay</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: REVIEW & PAYMENT */}
          {step === 3 && (
            <div className="space-y-4 text-xs">
              {/* Summary Card */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-orange-700">Trip Summary</span>
                    <h4 className="font-bold text-base text-slate-900">{vehicle.name}</h4>
                    <span className="text-slate-500 text-xs">
                      {vehicle.city} • {days} Days ({pickupDate} to {returnDate})
                    </span>
                  </div>
                  <span className="px-2.5 py-1 bg-slate-900 text-white font-bold text-[10px] rounded-lg uppercase">
                    {rentalMode.replace('_', ' ')}
                  </span>
                </div>

                <div className="text-[11px] text-slate-600 space-y-0.5 border-t border-slate-200/60 pt-2">
                  <div><strong>Pickup:</strong> {needsDoorstepDelivery ? `Doorstep (${deliveryAddress})` : pickupLocation} at {pickupTime}</div>
                  <div><strong>Traveler:</strong> {travelerName} ({travelerPhone})</div>
                </div>
              </div>

              {/* Transparent Cost Breakdown */}
              <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] pb-1 border-b border-slate-100">
                  Transparent Price Breakdown (0% SafarSetu Markup)
                </h4>

                <div className="flex justify-between text-slate-600">
                  <span>Base Vehicle Rental ({days} days @ ₹{vehicle.pricePerDaySelfDrive.toLocaleString('en-IN')}/day)</span>
                  <span className="font-semibold text-slate-900">₹{baseRental.toLocaleString('en-IN')}</span>
                </div>

                {driverAllowance > 0 && (
                  <div className="flex justify-between text-slate-600">
                    <span>Chauffeur Allowance ({days} days @ ₹800/day)</span>
                    <span className="font-semibold text-slate-900">₹{driverAllowance.toLocaleString('en-IN')}</span>
                  </div>
                )}

                {storytellerFee > 0 && (
                  <div className="flex justify-between text-orange-800">
                    <span>Certified Storyteller Escort Guide Fee ({days} days)</span>
                    <span className="font-semibold text-orange-950">₹{storytellerFee.toLocaleString('en-IN')}</span>
                  </div>
                )}

                {deliveryFee > 0 && (
                  <div className="flex justify-between text-slate-600">
                    <span>Doorstep Concierge Delivery Fee</span>
                    <span className="font-semibold text-slate-900">₹{deliveryFee}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-600">
                  <span>Govt. Commercial Passenger GST (5%)</span>
                  <span className="font-semibold text-slate-900">₹{taxes.toLocaleString('en-IN')}</span>
                </div>

                {refundableDeposit > 0 ? (
                  <div className="flex justify-between text-blue-700 bg-blue-50/70 p-2 rounded-lg font-medium">
                    <span>Refundable Security Deposit (Instant return at drop-off)</span>
                    <span className="font-bold">₹{refundableDeposit.toLocaleString('en-IN')}</span>
                  </div>
                ) : (
                  <div className="flex justify-between text-emerald-800 bg-emerald-50/70 p-2 rounded-lg font-bold">
                    <span>Security Deposit</span>
                    <span>₹0 (Zero Deposit Waived!)</span>
                  </div>
                )}

                <div className="flex justify-between text-base font-extrabold text-slate-950 pt-2 border-t border-slate-200">
                  <span>Total Payable Now</span>
                  <span className="text-xl">₹{grandTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-800">
                  Select Payment Method:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('UPI')}
                    className={`p-3 rounded-xl border text-center font-bold transition flex flex-col items-center gap-1 ${
                      paymentMethod === 'UPI' ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <QrCode className="w-4 h-4" />
                    <span>Instant UPI</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('CARD')}
                    className={`p-3 rounded-xl border text-center font-bold transition flex flex-col items-center gap-1 ${
                      paymentMethod === 'CARD' ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Card / NetBanking</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('PAY_AT_PICKUP')}
                    className={`p-3 rounded-xl border text-center font-bold transition flex flex-col items-center gap-1 ${
                      paymentMethod === 'PAY_AT_PICKUP' ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span>Pay at Handover</span>
                  </button>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-xs text-slate-700 hover:bg-slate-100 transition flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>

                <button
                  id="btn-confirm-rental-pay"
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleConfirmBooking}
                  className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-bold text-xs transition flex items-center gap-2 shadow-sm"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Confirming Reservation...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Pay ₹{grandTotal.toLocaleString('en-IN')} & Confirm</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: CONFIRMED VOUCHER */}
          {step === 4 && confirmedBooking && (
            <div className="space-y-4 text-xs text-center py-2 animate-fade-in">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-xs">
                <Check className="w-7 h-7 stroke-[2.5]" />
              </div>

              <div>
                <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
                  Reservation Confirmed & Vehicle Locked
                </span>
                <h3 className="font-serif font-bold text-2xl text-slate-950 mt-1">
                  Trip PNR: {confirmedBooking.pnr}
                </h3>
                <p className="text-slate-600 max-w-sm mx-auto text-xs mt-1">
                  Your rental voucher has been generated and dispatched to <strong>{confirmedBooking.travelerEmail}</strong>.
                </p>
              </div>

              {/* Voucher Card */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-left space-y-3 max-w-lg mx-auto">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-500">Reserved Fleet</span>
                    <div className="font-bold text-sm text-slate-900">{confirmedBooking.vehicleName}</div>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-600 text-white font-bold text-[10px] rounded-full">
                    {confirmedBooking.bookingStatus}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-700">
                  <div><strong>Pickup:</strong> {confirmedBooking.pickupDate} ({confirmedBooking.pickupTime})</div>
                  <div><strong>Return:</strong> {confirmedBooking.returnDate} ({confirmedBooking.returnTime})</div>
                  <div className="col-span-2"><strong>Location:</strong> {confirmedBooking.pickupLocation}</div>
                  <div><strong>Traveler:</strong> {confirmedBooking.travelerName}</div>
                  <div><strong>Contact:</strong> {confirmedBooking.travelerPhone}</div>
                  {confirmedBooking.chauffeurName && (
                    <div className="col-span-2 text-orange-800 font-semibold">
                      <strong>Assigned Chauffeur:</strong> {confirmedBooking.chauffeurName}
                    </div>
                  )}
                  <div className="col-span-2 pt-2 border-t border-slate-200 flex justify-between font-bold text-slate-900 text-xs">
                    <span>Total Paid:</span>
                    <span>₹{confirmedBooking.pricingBreakdown.totalAmount.toLocaleString('en-IN')} ({confirmedBooking.paymentMethod})</span>
                  </div>
                </div>
              </div>

              {/* 24x7 Roadside helpline note */}
              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-amber-900 text-left text-[11px] max-w-lg mx-auto flex items-start gap-2">
                <Shield className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <strong>SafarSetu 24x7 Roadside & Trip Assistance:</strong>
                  <div>
                    Call toll-free <strong>1800-SAFAR-HELP</strong> or WhatsApp priority desk with your PNR <strong>{confirmedBooking.pnr}</strong>.
                  </div>
                </div>
              </div>

              {/* Done CTA */}
              <div className="pt-3 flex justify-center gap-3">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition shadow-xs"
                >
                  Return to Rentals & View Bookings
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
