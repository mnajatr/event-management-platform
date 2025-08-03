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
import axios from 'axios';
import { useRouter } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const fetchProfile = () => {
    const token = localStorage.getItem('token');
    axios
      .get('http://localhost:8000/api/auth/profile', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setProfile(res.data.data);
      })
      .catch(() => toast.error('Failed to fetch profile'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }
    fetchProfile();
  }, [router]);

  const handleUpload = async () => {
    if (!file) {
      toast.error('No file selected');
      return;
    }

    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('profilePicture', file);

    setUploading(true);
    try {
      await axios.post(
        'http://localhost:8000/api/users/upload-profile-picture',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      toast.success('Profile picture updated!');
      fetchProfile();
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!profile) return null;

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <Card>
        <CardHeader className="flex flex-col items-center gap-2">
          <div className="w-20 h-20 rounded-full bg-muted overflow-hidden">
            {profile.profilePicture ? (
              <img
                src={`http://localhost:8000${profile.profilePicture}`}
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
          <div>
            <Label className="mb-2 block">Change Profile Picture</Label>
            <div className="flex items-center gap-4">
              <Input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
              <Button onClick={handleUpload} disabled={uploading}>
                {uploading ? 'Uploading...' : 'Upload'}
              </Button>
            </div>
          </div>

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

          <div>
            <Label className="mb-2 block">Password</Label>
            <Input type="password" value="********" disabled />
          </div>

          {/* Tombol kecil di pojok kanan bawah */}
          <div className="flex justify-end">
            <Button
              className="bg-black text-white px-4 py-2 text-sm"
              onClick={() => router.push('/profile/change-password')}
            >
              Reset Password
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
