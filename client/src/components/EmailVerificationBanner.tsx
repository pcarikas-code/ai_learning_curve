import { useState } from 'react';
import { X, Mail, AlertCircle } from 'lucide-react';
import { trpc } from '../lib/trpc';
import { Button } from './ui/button';

interface EmailVerificationBannerProps {
  email: string;
  onDismiss?: () => void;
}

export default function EmailVerificationBanner({ email, onDismiss }: EmailVerificationBannerProps) {
  const [dismissed, setDismissed] = useState(false);
  const [sent, setSent] = useState(false);
  
  const resendEmail = trpc.auth.resendVerificationEmail.useMutation({
    onSuccess: () => {
      setSent(true);
      setTimeout(() => setSent(false), 5000);
    },
  });

  const handleDismiss = () => {
    setDismissed(true);
    if (onDismiss) onDismiss();
  };

  if (dismissed) return null;

  return (
    <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-amber-400" />
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-amber-800">
            Email Verification Required
          </h3>
          <div className="mt-2 text-sm text-amber-700">
            <p>
              Please verify your email address ({email}) to unlock all features and ensure account security.
            </p>
          </div>
          <div className="mt-4 flex items-center gap-3">
            {sent ? (
              <div className="flex items-center text-sm text-green-700">
                <Mail className="h-4 w-4 mr-2" />
                Verification email sent! Check your inbox.
              </div>
            ) : (
              <Button
                size="sm"
                variant="outline"
                onClick={() => resendEmail.mutate()}
                disabled={resendEmail.isPending}
                className="bg-white hover:bg-amber-50 text-amber-800 border-amber-300"
              >
                {resendEmail.isPending ? 'Sending...' : 'Resend Verification Email'}
              </Button>
            )}
          </div>
        </div>
        <div className="ml-auto pl-3">
          <button
            onClick={handleDismiss}
            className="inline-flex text-amber-400 hover:text-amber-600 focus:outline-none"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
