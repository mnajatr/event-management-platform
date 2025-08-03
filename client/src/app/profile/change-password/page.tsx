'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ChangePasswordForm from '@/components/auth/ChangePasswordForm';
import { ShieldCheck } from 'lucide-react';
import ProtectedPage from '@/components/auth/ProtectedPage';

export default function ChangePasswordPage() {
  return (
    <ProtectedPage>
      <div className="max-w-md mx-auto py-10 px-4">
        <Card>
          <CardHeader className="flex flex-col items-center gap-2">
            <div className="bg-muted rounded-full w-14 h-14 flex items-center justify-center text-2xl">
              <ShieldCheck className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-center text-lg">Change Your Password</CardTitle>
            <p className="text-sm text-muted-foreground text-center">
              Make sure your new password is secure and easy to remember.
            </p>
          </CardHeader>
          <CardContent>
            <ChangePasswordForm />
          </CardContent>
        </Card>
      </div>
    </ProtectedPage>
  );
}
