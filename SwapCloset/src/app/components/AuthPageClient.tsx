'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  Eye,
  EyeOff,
  ArrowRight,
  Check,
  Leaf,
  Copy,
  Shirt,
  ArrowLeftRight,
  MapPin,
  Star,
} from 'lucide-react';
import AppLogo from '@/components/ui/AppLogo';

// ─── Mock credentials ────────────────────────────────────────────────
const MOCK_CREDENTIALS = {
  email: 'maya.alvarez@swapcloset.app',
  password: 'Swap2026!',
};

// ─── Login Form Types ─────────────────────────────────────────────────
interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

// ─── Signup Form Types ────────────────────────────────────────────────
interface SignupStep1Data {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  city: string;
}

const TOP_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const BOTTOM_SIZES = ['24', '26', '28', '30', '32', '34', '36'];
const SHOE_SIZES = ['6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '11'];
const STYLE_TAGS = [
  'Casual',
  'Boho',
  'Minimalist',
  'Streetwear',
  'Vintage',
  'Athletic',
  'Formal',
  'Cottagecore',
  'Y2K',
  'Preppy',
];

// ─── Features list ────────────────────────────────────────────────────
const features = [
  { icon: Shirt, text: 'List your unused clothes in minutes' },
  { icon: ArrowLeftRight, text: 'Swap directly — no money needed' },
  { icon: MapPin, text: 'Find swaps near you by location' },
  { icon: Leaf, text: 'Track your sustainability impact' },
  { icon: Star, text: 'Build your swap reputation & ratings' },
];

export default function AuthPageClient() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [signupStep, setSignupStep] = useState(1);
  const [selectedStyleTags, setSelectedStyleTags] = useState<string[]>([]);
  const [selectedTopSize, setSelectedTopSize] = useState('');
  const [selectedBottomSize, setSelectedBottomSize] = useState('');
  const [selectedShoeSize, setSelectedShoeSize] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [_step1Data, setStep1Data] = useState<SignupStep1Data | null>(null);

  // Login form
  const loginForm = useForm<LoginFormData>({
    defaultValues: { email: '', password: '', rememberMe: false },
  });

  // Signup step 1 form
  const signupForm = useForm<SignupStep1Data>({
    defaultValues: { fullName: '', email: '', password: '', confirmPassword: '', city: '' },
  });

  const handleCopy = (field: string, value: string) => {
    navigator.clipboard.writeText(value).catch(() => {});
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1500);
  };

  const handleLoginSubmit = (data: LoginFormData) => {
    // BACKEND INTEGRATION: POST /api/auth/login with { email, password, rememberMe }
    if (data.email !== MOCK_CREDENTIALS.email || data.password !== MOCK_CREDENTIALS.password) {
      loginForm.setError('email', {
        message: 'Invalid credentials — use the demo account below to sign in',
      });
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Welcome back, Maya!');
      router.push('/user-dashboard');
    }, 1200);
  };

  const handleSignupStep1 = (data: SignupStep1Data) => {
    if (data.password !== data.confirmPassword) {
      signupForm.setError('confirmPassword', { message: 'Passwords do not match' });
      return;
    }
    setStep1Data(data);
    setSignupStep(2);
  };

  const handleSignupStep2 = () => {
    // BACKEND INTEGRATION: POST /api/auth/register with form data + size preferences + style tags
    if (!selectedTopSize || !selectedBottomSize || !selectedShoeSize) {
      toast.error('Please select all size preferences');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Account created! Welcome to SwapCloset 🌿');
      router.push('/user-dashboard');
    }, 1400);
  };

  const toggleStyleTag = (tag: string) => {
    setSelectedStyleTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const fillDemoCredentials = () => {
    loginForm.setValue('email', MOCK_CREDENTIALS.email);
    loginForm.setValue('password', MOCK_CREDENTIALS.password);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel — brand */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] gradient-brand flex-col justify-between p-12 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 blob-primary opacity-40" />
        <div className="absolute bottom-0 left-0 w-72 h-72 blob-primary opacity-30" />

        {/* Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <AppLogo size={28} />
          </div>
          <span className="text-white font-700 text-xl">SwapCloset</span>
        </div>

        {/* Hero */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/15 text-white text-xs font-500 px-3 py-1.5 rounded-full mb-6">
            <Leaf size={12} />
            <span>Sustainable fashion, one swap at a time</span>
          </div>
          <h1 className="text-hero-xl text-white font-800 leading-tight mb-4">
            Your closet is
            <br />
            someone&apos;s treasure
          </h1>
          <p className="text-white/75 text-base leading-relaxed max-w-sm">
            Join thousands of fashion lovers who swap instead of shop. Refresh your wardrobe for
            free while keeping clothes out of landfills.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-10">
            {[
              { value: '24,800+', label: 'Active Swappers' },
              { value: '91,200+', label: 'Items Listed' },
              { value: '68 tons', label: 'Waste Prevented' },
            ].map((stat) => (
              <div key={`stat-${stat.label}`} className="bg-white/10 rounded-xl p-4">
                <p className="text-white font-700 text-xl tabular-nums">{stat.value}</p>
                <p className="text-white/65 text-xs mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="relative z-10 space-y-3">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div key={`feature-${f.text}`} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
                  <Icon size={14} className="text-white" />
                </div>
                <span className="text-white/80 text-sm">{f.text}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right panel — forms */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-background overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 mb-8 justify-center">
            <AppLogo size={36} />
            <span className="font-700 text-xl text-foreground">SwapCloset</span>
          </div>

          {/* Tab switcher */}
          <div className="flex bg-muted rounded-xl p-1 mb-8">
            {(['login', 'signup'] as const).map((tab) => (
              <button
                key={`tab-${tab}`}
                onClick={() => {
                  setActiveTab(tab);
                  setSignupStep(1);
                }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-600 transition-all duration-200 ${
                  activeTab === tab
                    ? 'bg-card text-foreground shadow-card'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          {/* ── LOGIN FORM ── */}
          {activeTab === 'login' && (
            <form
              onSubmit={loginForm.handleSubmit(handleLoginSubmit)}
              className="space-y-5 fade-in"
            >
              <div>
                <h2 className="text-2xl font-700 text-foreground mb-1">Welcome back</h2>
                <p className="text-sm text-muted-foreground">Sign in to manage your swaps</p>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-500 text-foreground mb-1.5">
                  Email address
                </label>
                <input
                  type="email"
                  className={`input-field ${loginForm.formState.errors.email ? 'error' : ''}`}
                  placeholder="you@example.com"
                  {...loginForm.register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Enter a valid email',
                    },
                  })}
                />
                {loginForm.formState.errors.email && (
                  <p className="mt-1.5 text-xs text-negative">
                    {loginForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-500 text-foreground">Password</label>
                  <button type="button" className="text-xs text-primary font-500 hover:underline">
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className={`input-field pr-10 ${loginForm.formState.errors.password ? 'error' : ''}`}
                    placeholder="••••••••"
                    {...loginForm.register('password', {
                      required: 'Password is required',
                      minLength: { value: 6, message: 'Minimum 6 characters' },
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {loginForm.formState.errors.password && (
                  <p className="mt-1.5 text-xs text-negative">
                    {loginForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              {/* Remember me */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="rememberMe"
                  className="w-4 h-4 accent-primary rounded"
                  {...loginForm.register('rememberMe')}
                />
                <label htmlFor="rememberMe" className="text-sm text-muted-foreground select-none">
                  Keep me signed in for 30 days
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary py-3 rounded-xl text-sm font-600 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ minHeight: 48 }}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <hr className="flex-1 border-border" />
                <span className="text-xs text-muted-foreground">or</span>
                <hr className="flex-1 border-border" />
              </div>

              {/* Google auth */}
              <button
                type="button"
                className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-border bg-card hover:bg-muted transition-colors text-sm font-500 text-foreground"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path
                    d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.616z"
                    fill="#4285F4"
                  />
                  <path
                    d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
                    fill="#34A853"
                  />
                  <path
                    d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z"
                    fill="#EA4335"
                  />
                </svg>
                Continue with Google
              </button>

              {/* Demo credentials box */}
              <div className="bg-secondary border border-primary/20 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-600 text-primary uppercase tracking-wide">
                    Demo Account
                  </p>
                  <button
                    type="button"
                    onClick={fillDemoCredentials}
                    className="text-xs font-600 text-primary hover:underline"
                  >
                    Auto-fill
                  </button>
                </div>
                <div className="space-y-2">
                  {[
                    { label: 'Email', value: MOCK_CREDENTIALS.email, field: 'email' },
                    { label: 'Password', value: MOCK_CREDENTIALS.password, field: 'password' },
                  ].map((cred) => (
                    <div
                      key={`cred-${cred.field}`}
                      className="flex items-center justify-between bg-card rounded-lg px-3 py-2"
                    >
                      <div>
                        <p className="text-[10px] text-muted-foreground font-500 uppercase tracking-wide">
                          {cred.label}
                        </p>
                        <p className="text-xs font-500 text-foreground font-mono">{cred.value}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(cred.field, cred.value)}
                        className="p-1.5 rounded-md hover:bg-muted transition-colors"
                        aria-label={`Copy ${cred.label}`}
                      >
                        {copiedField === cred.field ? (
                          <Check size={14} className="text-positive" />
                        ) : (
                          <Copy size={14} className="text-muted-foreground" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </form>
          )}

          {/* ── SIGNUP FORM ── */}
          {activeTab === 'signup' && (
            <div className="fade-in">
              {/* Step progress */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  {[1, 2].map((step) => (
                    <React.Fragment key={`step-frag-${step}`}>
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-700 transition-all duration-300 ${
                          signupStep >= step
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {signupStep > step ? <Check size={14} /> : step}
                      </div>
                      {step < 2 && (
                        <div
                          className={`flex-1 h-0.5 rounded transition-all duration-500 ${signupStep > step ? 'bg-primary' : 'bg-border'}`}
                        />
                      )}
                    </React.Fragment>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Step {signupStep} of 2 —{' '}
                  {signupStep === 1 ? 'Account details' : 'Style preferences'}
                </p>
              </div>

              {/* Step 1 */}
              {signupStep === 1 && (
                <form onSubmit={signupForm.handleSubmit(handleSignupStep1)} className="space-y-4">
                  <div>
                    <h2 className="text-2xl font-700 text-foreground mb-1">Create your account</h2>
                    <p className="text-sm text-muted-foreground">
                      Start swapping in under 2 minutes
                    </p>
                  </div>

                  {/* Full name */}
                  <div>
                    <label className="block text-sm font-500 text-foreground mb-1.5">
                      Full name
                    </label>
                    <input
                      type="text"
                      className={`input-field ${signupForm.formState.errors.fullName ? 'error' : ''}`}
                      placeholder="Maya Alvarez"
                      {...signupForm.register('fullName', { required: 'Full name is required' })}
                    />
                    {signupForm.formState.errors.fullName && (
                      <p className="mt-1.5 text-xs text-negative">
                        {signupForm.formState.errors.fullName.message}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-500 text-foreground mb-1.5">
                      Email address
                    </label>
                    <input
                      type="email"
                      className={`input-field ${signupForm.formState.errors.email ? 'error' : ''}`}
                      placeholder="you@example.com"
                      {...signupForm.register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: 'Enter a valid email',
                        },
                      })}
                    />
                    {signupForm.formState.errors.email && (
                      <p className="mt-1.5 text-xs text-negative">
                        {signupForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-sm font-500 text-foreground mb-1.5">City</label>
                    <p className="text-xs text-muted-foreground mb-1.5">
                      Used to find nearby swap partners
                    </p>
                    <input
                      type="text"
                      className={`input-field ${signupForm.formState.errors.city ? 'error' : ''}`}
                      placeholder="Portland, OR"
                      {...signupForm.register('city', { required: 'City is required' })}
                    />
                    {signupForm.formState.errors.city && (
                      <p className="mt-1.5 text-xs text-negative">
                        {signupForm.formState.errors.city.message}
                      </p>
                    )}
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-500 text-foreground mb-1.5">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className={`input-field pr-10 ${signupForm.formState.errors.password ? 'error' : ''}`}
                        placeholder="Min. 8 characters"
                        {...signupForm.register('password', {
                          required: 'Password is required',
                          minLength: { value: 8, message: 'Minimum 8 characters' },
                        })}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        aria-label="Toggle password visibility"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {signupForm.formState.errors.password && (
                      <p className="mt-1.5 text-xs text-negative">
                        {signupForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>

                  {/* Confirm password */}
                  <div>
                    <label className="block text-sm font-500 text-foreground mb-1.5">
                      Confirm password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        className={`input-field pr-10 ${signupForm.formState.errors.confirmPassword ? 'error' : ''}`}
                        placeholder="••••••••"
                        {...signupForm.register('confirmPassword', {
                          required: 'Please confirm your password',
                        })}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        aria-label="Toggle confirm password visibility"
                      >
                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {signupForm.formState.errors.confirmPassword && (
                      <p className="mt-1.5 text-xs text-negative">
                        {signupForm.formState.errors.confirmPassword.message}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full btn-primary py-3 rounded-xl text-sm font-600 flex items-center justify-center gap-2"
                  >
                    Continue
                    <ArrowRight size={16} />
                  </button>

                  <p className="text-xs text-muted-foreground text-center">
                    By continuing, you agree to our{' '}
                    <button type="button" className="text-primary hover:underline">
                      Terms of Service
                    </button>{' '}
                    and{' '}
                    <button type="button" className="text-primary hover:underline">
                      Privacy Policy
                    </button>
                  </p>
                </form>
              )}

              {/* Step 2 */}
              {signupStep === 2 && (
                <div className="space-y-5 fade-in">
                  <div>
                    <h2 className="text-2xl font-700 text-foreground mb-1">
                      Your style preferences
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Help us find the best swap matches for you
                    </p>
                  </div>

                  {/* Top size */}
                  <div>
                    <label className="block text-sm font-500 text-foreground mb-2">Top size</label>
                    <div className="flex flex-wrap gap-2">
                      {TOP_SIZES.map((size) => (
                        <button
                          key={`top-${size}`}
                          type="button"
                          onClick={() => setSelectedTopSize(size)}
                          className={`px-4 py-2 rounded-lg text-sm font-500 border transition-all duration-150 ${
                            selectedTopSize === size
                              ? 'bg-primary text-primary-foreground border-primary'
                              : 'bg-card border-border text-foreground hover:border-primary/50'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Bottom size */}
                  <div>
                    <label className="block text-sm font-500 text-foreground mb-2">
                      Bottom size (waist)
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {BOTTOM_SIZES.map((size) => (
                        <button
                          key={`bottom-${size}`}
                          type="button"
                          onClick={() => setSelectedBottomSize(size)}
                          className={`px-4 py-2 rounded-lg text-sm font-500 border transition-all duration-150 ${
                            selectedBottomSize === size
                              ? 'bg-primary text-primary-foreground border-primary'
                              : 'bg-card border-border text-foreground hover:border-primary/50'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Shoe size */}
                  <div>
                    <label className="block text-sm font-500 text-foreground mb-2">
                      Shoe size (US)
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {SHOE_SIZES.map((size) => (
                        <button
                          key={`shoe-${size}`}
                          type="button"
                          onClick={() => setSelectedShoeSize(size)}
                          className={`px-3 py-2 rounded-lg text-sm font-500 border transition-all duration-150 ${
                            selectedShoeSize === size
                              ? 'bg-primary text-primary-foreground border-primary'
                              : 'bg-card border-border text-foreground hover:border-primary/50'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Style tags */}
                  <div>
                    <label className="block text-sm font-500 text-foreground mb-1.5">
                      Style tags
                    </label>
                    <p className="text-xs text-muted-foreground mb-2">
                      Pick all that describe your style
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {STYLE_TAGS.map((tag) => (
                        <button
                          key={`style-${tag}`}
                          type="button"
                          onClick={() => toggleStyleTag(tag)}
                          className={`px-3 py-1.5 rounded-full text-xs font-500 border transition-all duration-150 ${
                            selectedStyleTags.includes(tag)
                              ? 'bg-accent text-accent-foreground border-accent'
                              : 'bg-card border-border text-muted-foreground hover:border-accent/50 hover:text-foreground'
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setSignupStep(1)}
                      className="flex-1 py-3 rounded-xl border border-border text-sm font-600 text-foreground hover:bg-muted transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleSignupStep2}
                      disabled={isLoading}
                      className="flex-[2] btn-primary py-3 rounded-xl text-sm font-600 flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                      {isLoading ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Creating account...
                        </span>
                      ) : (
                        <>
                          <span>Create Account</span>
                          <Check size={16} />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Footer */}
          <p className="text-center text-xs text-muted-foreground mt-6">
            {activeTab === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              type="button"
              onClick={() => setActiveTab(activeTab === 'login' ? 'signup' : 'login')}
              className="text-primary font-600 hover:underline"
            >
              {activeTab === 'login' ? 'Create one' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
