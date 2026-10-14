import React, { useState } from 'react';
import { X, User, Store, ArrowRight, ShieldCheck } from 'lucide-react';
import { UserSession } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (session: UserSession) => void;
  initialRole?: 'traveler' | 'host';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  initialRole = 'traveler'
}) => {
  const [role, setRole] = useState<'traveler' | 'host'>(initialRole);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');

  if (!isOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    setStep('otp');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const session: UserSession = {
      id: 'usr-' + Date.now(),
      name: name.trim(),
      phone: phone.trim(),
      role: role
    };
    onLogin(session);
    onClose();
  };

  return (
    <div id="auth-modal-backdrop" className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div id="auth-modal-box" className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-slate-200 text-left">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-[#faf8f5]">
          <div>
            <span className="text-[10px] uppercase font-bold text-orange-700 tracking-wider">
              {role === 'traveler' ? "Traveler Pass & DigiLocker Sync" : "Verified Partner Portal (0% Fee)"}
            </span>
            <h3 className="font-serif font-bold text-xl text-slate-950">
              {role === 'traveler' ? "Log in to SafarSetu" : "Host & Operator Sign In"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="p-3 bg-slate-100 flex gap-1 text-xs font-bold">
          <button
            onClick={() => setRole('traveler')}
            className={`flex-1 py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
              role === 'traveler' ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-600'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Traveler</span>
          </button>
          <button
            onClick={() => setRole('host')}
            className={`flex-1 py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
              role === 'host' ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-600'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>Host / Operator</span>
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 text-xs space-y-4">
          {step === 'phone' ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Your Full Name:</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={role === 'traveler' ? "e.g. Aditi Sharma" : "e.g. Anand Menon (Host)"}
                  className="w-full p-3 bg-[#faf8f5] border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-1 focus:ring-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Mobile Number (India +91):</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full p-3 bg-[#faf8f5] border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-1 focus:ring-slate-900"
                  required
                />
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-[11px]">Direct Aadhaar / DigiLocker mobile verification</span>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-slate-900 hover:bg-orange-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition"
              >
                <span>Send Verification OTP</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-600">
                <span>Enter 4-digit code sent to <strong>{phone}</strong>:</span>
                <span className="block text-[10px] text-slate-400 mt-0.5">(For demonstration, enter any 4 digits, e.g. 1234)</span>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Verification OTP:</label>
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="1 2 3 4"
                  className="w-full p-3 bg-[#faf8f5] border border-slate-200 rounded-xl text-center text-lg font-mono font-bold tracking-widest focus:outline-none focus:ring-1 focus:ring-slate-900"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-slate-900 hover:bg-orange-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition"
              >
                <span>Verify & Sign In</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
