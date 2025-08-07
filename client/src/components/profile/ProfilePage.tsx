'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { toast } from 'sonner';
import api from '@/lib/axios';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getUserRole, isTokenExpired } from '@/lib/auth';
import ProfilePictureUploader from './UploadPicture';

interface Coupon {
  id: number;
  couponCode: string;
  discountValue: number;
  expiresAt: string;
}

interface ProfileData {
  fullName: string;
  email: string;
  referralCode: string;
  pointsBalance: number;
  coupons: Coupon[];
  profilePicture: string | null;
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [selectedCoupon, setSelectedCoupon] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);
  const role = getUserRole();

  const fetchProfile = async () => {
    try {
      const res = await api.get("/auth/profile");
      setProfile(res.data.data);
    } catch (error) {
      toast.error("Failed to refetch profile");
    }
  };

  useEffect(() => {
    const init = async () => {
      if (isTokenExpired()) {
        toast.error("Session expired. Please login again.");
        localStorage.clear();
        router.replace("/auth/login");
        return;
      }

      try {
        const res = await api.get("/auth/profile");
        setProfile(res.data.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            toast.error("Unauthorized. Please login again.");
            router.replace("/auth/login");
          } else {
            toast.error(error.response?.data?.message || "Failed to fetch profile");
          }
        } else {
          toast.error("Failed to fetch profile");
        }
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [router]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!profile) return null;

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <Card>
        <CardHeader className="flex flex-col items-center gap-2">
          <div className="w-20 h-20 rounded-full bg-muted overflow-hidden">
            {profile.profilePicture ? (
              <img
                src={profile.profilePicture}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl">👤</div>
            )}
          </div>
          <CardTitle className="text-center">{profile.fullName}</CardTitle>
          <p className="text-sm text-muted-foreground">{profile.email}</p>
        </CardHeader>

        <CardContent className="grid gap-5 relative">
          {/* Upload Profile Picture */}
          <ProfilePictureUploader
            currentPicture={profile.profilePicture}
            onUpload={fetchProfile}
          />

          {/* Only CUSTOMER can see these */}
          {role === 'CUSTOMER' && (
            <>
              <div>
                <Label className="mb-2 block">Referral Code</Label>
                <Input value={profile.referralCode} disabled />
              </div>

              <div>
                <Label className="mb-2 block">My Voucher</Label>
                {profile.coupons?.length > 0 ? (
                  <Select
                    onValueChange={(val) => setSelectedCoupon(val)}
                    value={selectedCoupon}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a coupon" />
                    </SelectTrigger>
                    <SelectContent>
                      {profile.coupons.map((coupon) => (
                        <SelectItem key={coupon.id} value={coupon.couponCode}>
                          {coupon.couponCode} - Rp{' '}
                          {coupon.discountValue.toLocaleString('id-ID')} (valid until{' '}
                          {new Date(coupon.expiresAt).toLocaleDateString()})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-sm text-muted-foreground mt-1">
                    No active coupons
                  </p>
                )}
              </div>

              <div>
                <Label className="mb-2 block">My Point</Label>
                <Input
                  value={`Rp ${profile.pointsBalance.toLocaleString('id-ID')}`}
                  disabled
                />
              </div>
            </>
          )}

          <div>
            <Label className="mb-2 block">Password</Label>
            <Input type="password" value="********" disabled />
          </div>

          <div className="flex justify-end">
            <Button
              className="bg-black text-white px-4 py-2 text-sm"
              onClick={() => router.push('/profile/change-password')}
            >
              Change Password
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
