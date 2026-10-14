import React, { useState } from 'react';
import { Compass, Sparkles, Store, ArrowRight, Menu, X, ShieldAlert, LogOut, User, Car, Activity, Star, Briefcase } from 'lucide-react';
import { UserSession } from '../types';

interface HeaderProps {
  currentView: 'landing' | 'planner' | 'operator' | 'partner' | 'admin_ops' | 'rentals' | 'telangana';
  onNavigate: (view: 'landing' | 'planner' | 'operator' | 'partner' | 'admin_ops' | 'rentals' | 'telangana') => void;
  onOpenMyTrips: () => void;
  onOpenSafarMitra: () => void;
  onScrollTo: (id: string) => void;
  isOffline?: boolean;
  onToggleOffline?: () => void;
  onOpenAuth: () => void;
  onOpenHostAuth: () => void;
  user: UserSession | null;
  onLogout: () => void;
  savedTripsCount: number;
  onTriggerSOS: () => void;
  selectedLanguage?: string;
  onChangeLanguage?: (lang: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  onOpenMyTrips,
  onOpenSafarMitra,
  onScrollTo,
  onOpenAuth,
  onOpenHostAuth,
  user,
  onLogout,
  savedTripsCount,
  onTriggerSOS
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header id="global-header" className="sticky top-0 z-40 glass-header border-b border-slate-200/80 transition-all duration-300 w-full box-border">
        <div className="w-full max-w-[1720px] mx-auto px-3 sm:px-6 lg:px-8 h-20 flex items-center justify-between box-border min-w-0">
          
          {/* Brand Logo & Navigation Links */}
          <div className="flex items-center gap-3 xl:gap-4 2xl:gap-6 min-w-0">
            <button
              id="brand-logo-btn"
              onClick={() => onNavigate('landing')}
              className="flex items-center gap-2 sm:gap-2.5 group cursor-pointer text-left focus:outline-none shrink-0"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-md transition-transform group-hover:scale-105 duration-300 shrink-0">
                <Compass className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-serif font-bold text-lg sm:text-xl 2xl:text-2xl tracking-tight text-slate-950 whitespace-nowrap">
                    Safar<span className="text-orange-600 font-sans font-black">Setu</span>
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-600 self-end mb-1"></span>
                </div>
                <p className="text-[10px] tracking-wider uppercase font-semibold text-slate-600 -mt-1 hidden 2xl:block">
                  Incredible India • Smart Multimodal Travel
                </p>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden xl:flex items-center gap-0.5 2xl:gap-1 text-xs 2xl:text-sm font-semibold text-slate-700 min-w-0">
              <button
                id="nav-explore-btn"
                onClick={() => {
                  if (currentView !== 'landing') onNavigate('landing');
                  setTimeout(() => onScrollTo('destination-discovery'), 100);
                }}
                className="px-2 2xl:px-2.5 py-2 rounded-lg hover:text-slate-950 hover:bg-slate-100/70 transition whitespace-nowrap"
              >
                Explore India
              </button>
              <button
                id="nav-interests-btn"
                onClick={() => {
                  if (currentView !== 'landing') onNavigate('landing');
                  setTimeout(() => onScrollTo('travel-styles'), 100);
                }}
                className="px-2 2xl:px-2.5 py-2 rounded-lg hover:text-slate-950 hover:bg-slate-100/70 transition whitespace-nowrap"
              >
                Travel by Interest
              </button>
              <button
                id="nav-reviews-btn"
                onClick={() => {
                  if (currentView !== 'landing') onNavigate('landing');
                  setTimeout(() => onScrollTo('customer-reviews-section'), 100);
                }}
                className="px-2 2xl:px-2.5 py-2 rounded-lg hover:text-slate-950 hover:bg-slate-100/70 transition whitespace-nowrap"
              >
                Reviews
              </button>
              <button
                id="nav-planner-btn"
                onClick={() => onNavigate('planner')}
                className={`px-2 2xl:px-2.5 py-2 rounded-lg hover:text-slate-950 hover:bg-slate-100/70 transition flex items-center gap-1.5 whitespace-nowrap ${currentView === 'planner' ? 'bg-slate-100 text-slate-950' : ''}`}
              >
                <span>Trip Planner</span>
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-orange-100 text-orange-900 hidden 2xl:inline-block">
                  6 Steps
                </span>
              </button>
              <button
                id="nav-rentals-btn"
                onClick={() => onNavigate('rentals')}
                className={`px-2 2xl:px-2.5 py-2 rounded-lg hover:text-slate-950 hover:bg-slate-100/70 transition flex items-center gap-1.5 whitespace-nowrap ${currentView === 'rentals' ? 'bg-slate-100 text-slate-950 font-bold' : ''}`}
              >
                <Car className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                <span>Rentals</span>
                <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-900 hidden 2xl:inline-block">
                  Self-Drive
                </span>
              </button>
              <button
                id="nav-telangana-tourism-btn"
                onClick={() => onNavigate('telangana')}
                className={`px-2 2xl:px-2.5 py-2 rounded-lg hover:text-slate-950 hover:bg-slate-100/70 transition flex items-center gap-1.5 whitespace-nowrap ${currentView === 'telangana' ? 'bg-amber-100 text-amber-950 font-bold' : 'text-slate-700'}`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>Telangana Tourism</span>
                <span className="text-[9px] uppercase font-extrabold px-1.5 py-0.5 rounded bg-amber-200 text-amber-900 hidden 2xl:inline-block">
                  Pass
                </span>
              </button>
              <button
                id="nav-trips-btn"
                onClick={onOpenMyTrips}
                className="px-2 2xl:px-2.5 py-2 rounded-lg hover:text-slate-950 hover:bg-slate-100/70 transition flex items-center gap-1.5 whitespace-nowrap"
              >
                <span>My Trips</span>
                <span id="nav-trip-count-badge" className="w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] flex items-center justify-center font-bold shrink-0">
                  {savedTripsCount}
                </span>
              </button>
              <button
                id="nav-safarmitra-btn"
                onClick={onOpenSafarMitra}
                className="px-2 2xl:px-2.5 py-2 rounded-lg hover:text-slate-950 hover:bg-slate-100/70 transition flex items-center gap-1.5 text-slate-900 whitespace-nowrap"
              >
                <Sparkles className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                <span>SafarMitra AI</span>
              </button>

              {/* Driver & Storyteller Partner Portal Entry */}
              <button
                id="header-partner-portal-btn"
                onClick={() => onNavigate('partner')}
                className={`flex items-center gap-1.5 px-2 2xl:px-2.5 py-2 rounded-lg text-xs 2xl:text-sm font-semibold transition whitespace-nowrap ${
                  currentView === 'partner'
                    ? 'bg-orange-100 text-orange-950'
                    : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100/80'
                }`}
                title="Driver & Storyteller Operations Portal"
              >
                <Briefcase className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                <span>Partner Portal</span>
              </button>

              {/* Homestay Host Portal Entry */}
              <button
                id="header-host-portal-btn"
                onClick={() => {
                  if (user && user.role === 'host') {
                    onNavigate('operator');
                  } else {
                    onOpenHostAuth();
                  }
                }}
                className="flex items-center gap-1.5 px-2 2xl:px-2.5 py-2 rounded-lg text-xs 2xl:text-sm font-semibold text-slate-700 hover:text-slate-950 hover:bg-slate-100/80 transition whitespace-nowrap"
                title="Homestay Host Portal (0% commission)"
              >
                <Store className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                <span>Host Portal</span>
              </button>
            </nav>
          </div>

          {/* Right Action Utilities */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 2xl:gap-3 shrink-0">
            
            {/* Admin Ops Desk */}
            <button
              id="header-admin-ops-btn"
              onClick={() => onNavigate('admin_ops')}
              className={`hidden 2xl:flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-medium transition whitespace-nowrap ${
                currentView === 'admin_ops'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
              title="Centralized Operations & Fleet Control Desk"
            >
              <Activity className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Ops Desk</span>
            </button>

            {/* Authentication Container */}
            <div className="shrink-0">
              {!user ? (
                <button
                  id="header-login-btn"
                  onClick={onOpenAuth}
                  className="hidden sm:flex px-2.5 2xl:px-3.5 py-2 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-100 transition border border-slate-200 shadow-xs items-center gap-1.5 whitespace-nowrap"
                >
                  <User className="w-3.5 h-3.5 shrink-0" />
                  <span>Log in</span>
                </button>
              ) : (
                <div id="logged-in-profile" className="flex items-center gap-2 bg-white border border-slate-200 py-1.5 px-2.5 sm:px-3 rounded-xl shadow-xs">
                  <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
                    {user.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex flex-col leading-tight hidden md:block text-left">
                    <span className="text-xs font-bold text-slate-800">{user.name}</span>
                    <span className="text-[9px] text-slate-500 uppercase font-semibold">{user.role}</span>
                  </div>
                  <button
                    id="header-logout-btn"
                    onClick={onLogout}
                    title="Sign Out"
                    className="text-slate-400 hover:text-slate-700 text-xs ml-1 p-1 shrink-0"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Primary CTA: Plan My Trip */}
            <button
              id="header-cta-plan-btn"
              onClick={() => onNavigate('planner')}
              className="px-3 sm:px-4 2xl:px-5 py-2 sm:py-2.5 rounded-xl bg-slate-900 hover:bg-orange-700 text-white font-bold text-xs 2xl:text-sm shadow-md transition-all duration-300 active:scale-95 flex items-center gap-1.5 sm:gap-2 shrink-0 whitespace-nowrap"
            >
              <span>Plan My Trip</span>
              <ArrowRight className="w-3.5 h-3.5 shrink-0" />
            </button>

            {/* Mobile / Tablet Drawer Toggle */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 focus:outline-none shrink-0"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>
        </div>
      </header>

      {/* MOBILE DRAWER NAVIGATION */}
      {mobileMenuOpen && (
        <div id="mobile-nav-drawer" className="xl:hidden fixed inset-x-0 top-20 z-30 bg-white border-b border-slate-200 shadow-xl px-4 sm:px-6 py-5 space-y-4 max-h-[calc(100vh-5rem)] overflow-y-auto box-border">
          {/* User Profile / Auth for mobile viewports */}
          <div className="sm:hidden pb-3 border-b border-slate-100">
            {!user ? (
              <button
                id="mobile-login-btn"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth();
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-bold flex items-center justify-center gap-2 border border-slate-200 transition"
              >
                <User className="w-4 h-4 text-orange-600" />
                <span>Log In to SafarSetu Account</span>
              </button>
            ) : (
              <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                    {user.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">{user.name}</div>
                    <div className="text-[10px] text-slate-500 uppercase">{user.role}</div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onLogout();
                  }}
                  className="text-xs text-rose-600 font-bold flex items-center gap-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3 text-xs sm:text-sm font-semibold text-slate-800">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (currentView !== 'landing') onNavigate('landing');
                setTimeout(() => onScrollTo('destination-discovery'), 100);
              }}
              className="p-3 text-left bg-slate-50 rounded-xl hover:bg-slate-100 flex items-center gap-2"
            >
              <Compass className="w-4 h-4 text-orange-600" />
              <span>Explore India</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (currentView !== 'landing') onNavigate('landing');
                setTimeout(() => onScrollTo('travel-styles'), 100);
              }}
              className="p-3 text-left bg-slate-50 rounded-xl hover:bg-slate-100 flex items-center gap-2"
            >
              <Store className="w-4 h-4 text-orange-600" />
              <span>Interests</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate('planner');
              }}
              className="p-3 text-left bg-slate-50 rounded-xl hover:bg-slate-100 flex items-center gap-2"
            >
              <ArrowRight className="w-4 h-4 text-orange-600" />
              <span>Trip Planner</span>
            </button>
            <button
              id="mobile-nav-rentals-btn"
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate('rentals');
              }}
              className="p-3 text-left bg-slate-50 rounded-xl hover:bg-slate-100 flex items-center gap-2 font-bold text-slate-900"
            >
              <Car className="w-4 h-4 text-orange-600" />
              <span>Rentals & Self-Drive</span>
            </button>
            <button
              id="mobile-nav-telangana-btn"
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate('telangana');
              }}
              className="p-3 text-left bg-amber-50 border border-amber-200/80 rounded-xl hover:bg-amber-100 flex items-center justify-between font-bold text-amber-950"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Telangana Tourism</span>
              </div>
              <span className="text-[9px] uppercase font-extrabold px-2 py-0.5 rounded bg-amber-200 text-amber-950">
                Dedicated Pass
              </span>
            </button>
            <button
              id="mobile-nav-reviews-btn"
              onClick={() => {
                setMobileMenuOpen(false);
                if (currentView !== 'landing') onNavigate('landing');
                setTimeout(() => onScrollTo('customer-reviews-section'), 100);
              }}
              className="p-3 text-left bg-slate-50 rounded-xl hover:bg-slate-100 flex items-center gap-2 font-medium text-slate-900"
            >
              <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
              <span>Traveler Reviews (4.4★)</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenMyTrips();
              }}
              className="p-3 text-left bg-slate-50 rounded-xl hover:bg-slate-100 flex items-center gap-2"
            >
              <User className="w-4 h-4 text-orange-600" />
              <span>My Trips ({savedTripsCount})</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSafarMitra();
              }}
              className="p-3 text-left bg-slate-50 rounded-xl hover:bg-slate-100 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-orange-600" />
              <span>SafarMitra AI</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate('partner');
              }}
              className="p-3 text-left bg-orange-50 rounded-xl hover:bg-orange-100 flex items-center gap-2 font-bold text-orange-950"
            >
              <Car className="w-4 h-4 text-orange-600" />
              <span>Driver & Storyteller Portal</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate('admin_ops');
              }}
              className="p-3 text-left bg-slate-100 rounded-xl hover:bg-slate-200 flex items-center gap-2 font-semibold text-slate-900"
            >
              <Activity className="w-4 h-4 text-emerald-600" />
              <span>Operations Control Desk</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (user && user.role === 'host') onNavigate('operator');
                else onOpenHostAuth();
              }}
              className="p-3 text-left bg-slate-50 rounded-xl hover:bg-slate-100 flex items-center gap-2"
            >
              <Store className="w-4 h-4 text-orange-600" />
              <span>Homestay Host Portal</span>
            </button>
          </div>
          
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Tourist Police Helpline: 112</span>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onTriggerSOS();
              }}
              className="text-red-600 font-bold flex items-center gap-1"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Tourist SOS</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};
