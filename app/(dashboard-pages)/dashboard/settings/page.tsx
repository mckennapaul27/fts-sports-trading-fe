"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import toast from "react-hot-toast";
import { ClimbingBoxLoader } from "react-spinners";

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
}

interface EmailPreferences {
  dailySelections: boolean;
  resultsUpdates: boolean;
  monthlyPerformanceReport: boolean;
  systemUpdates: boolean;
  billingReminders: boolean;
  marketingEmails: boolean;
}

// Fetcher function for SWR
const fetcher = async (url: string, token: string) => {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });

  if (!response.ok) {
    const error = new Error("Failed to fetch user profile");
    throw error;
  }

  return response.json();
};

export default function SettingsPage() {
  const { data: session } = useSession();
  const apiUrl = process.env.NEXT_PUBLIC_SERVER_URL || "";
  const profileUrl = session?.accessToken
    ? `${apiUrl}/api/users/profile`
    : null;

  // Fetch user profile data
  const {
    data: profileData,
    error: profileError,
    isLoading: profileLoading,
    mutate: mutateProfile,
  } = useSWR<UserProfile>(
    profileUrl ? [profileUrl, session?.accessToken] : null,
    ([url, token]: [string, string]) => fetcher(url, token),
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000,
    }
  );

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Email preferences state
  const [emailPreferences, setEmailPreferences] = useState<EmailPreferences>({
    dailySelections: false,
    resultsUpdates: false,
    monthlyPerformanceReport: false,
    systemUpdates: false,
    billingReminders: false,
    marketingEmails: false,
  });

  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [isSavingPreferences, setIsSavingPreferences] = useState(false);

  // Initialize profile form when data loads
  useEffect(() => {
    if (profileData) {
      setProfileForm({
        firstName: profileData.firstName || "",
        lastName: profileData.lastName || "",
        email: profileData.email || "",
      });
    }
  }, [profileData]);

  // Fetch email preferences
  useEffect(() => {
    const fetchPreferences = async () => {
      if (!session?.accessToken) return;

      try {
        const response = await fetch(`${apiUrl}/api/users/email-preferences`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.accessToken}`,
          },
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          if (data.emailPreferences) {
            setEmailPreferences(data.emailPreferences);
          }
        }
      } catch (error) {
        console.error("Failed to fetch email preferences:", error);
      }
    };

    fetchPreferences();
  }, [session?.accessToken, apiUrl]);

  // Handle profile update
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.accessToken) return;

    setIsSavingProfile(true);
    try {
      const response = await fetch(`${apiUrl}/api/users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
        credentials: "include",
        body: JSON.stringify(profileForm),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to update profile");
      }

      toast.success("Profile updated successfully");
      mutateProfile();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update profile"
      );
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Handle password change
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.accessToken) return;

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    setIsSavingPassword(true);
    try {
      const response = await fetch(`${apiUrl}/api/users/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
        credentials: "include",
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to change password");
      }

      toast.success("Password changed successfully");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to change password"
      );
    } finally {
      setIsSavingPassword(false);
    }
  };

  // Handle email preferences update
  const handlePreferencesSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.accessToken) return;

    setIsSavingPreferences(true);
    try {
      const response = await fetch(`${apiUrl}/api/users/email-preferences`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
        credentials: "include",
        body: JSON.stringify({ emailPreferences }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || "Failed to update email preferences"
        );
      }

      toast.success("Email preferences updated successfully");
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Failed to update email preferences"
      );
    } finally {
      setIsSavingPreferences(false);
    }
  };

  // Handle cancel (reset forms)
  const handleCancel = () => {
    if (profileData) {
      setProfileForm({
        firstName: profileData.firstName || "",
        lastName: profileData.lastName || "",
        email: profileData.email || "",
      });
    }
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <ClimbingBoxLoader color="#1e3a8a" />
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <p className="text-red-500">Failed to load profile data</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-dark-navy mb-1">Settings</h1>
        <p className="text-dark-navy/70">
          Manage your account preferences and notification settings.
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="bg-cream/50 border border-gray-200">
          <TabsTrigger
            value="profile"
            className="data-[state=active]:bg-gold data-[state=active]:text-dark-navy cursor-pointer"
          >
            Profile
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="data-[state=active]:bg-gold data-[state=active]:text-dark-navy cursor-pointer"
          >
            Notifications
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="mt-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm space-y-8">
            {/* Profile Information Section */}
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-dark-navy mb-4">
                  Profile Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-dark-navy">
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      type="text"
                      value={profileForm.firstName}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          firstName: e.target.value,
                        })
                      }
                      className="border-gray-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-dark-navy">
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      type="text"
                      value={profileForm.lastName}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          lastName: e.target.value,
                        })
                      }
                      className="border-gray-300"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-dark-navy">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileForm.email}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, email: e.target.value })
                    }
                    className="border-gray-300"
                  />
                  <p className="text-sm text-dark-navy/60 mt-1">
                    This email is used for login and receiving selections.
                  </p>
                </div>
              </div>

              {/* Change Password Section */}
              <div>
                <h2 className="text-xl font-bold text-dark-navy mb-4">
                  Change Password
                </h2>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword" className="text-dark-navy">
                      Current Password
                    </Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          currentPassword: e.target.value,
                        })
                      }
                      className="border-gray-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-dark-navy">
                      New Password
                    </Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          newPassword: e.target.value,
                        })
                      }
                      className="border-gray-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-dark-navy">
                      Confirm New Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="border-gray-300"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col md:flex-row gap-4 pt-4">
                <Button
                  type="submit"
                  variant="secondary"
                  className="bg-gold text-dark-navy hover:bg-gold/90 w-full md:w-auto"
                  disabled={isSavingProfile || isSavingPassword}
                >
                  {isSavingProfile || isSavingPassword
                    ? "Saving..."
                    : "Save Changes"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full md:w-auto"
                  onClick={handleCancel}
                  disabled={isSavingProfile || isSavingPassword}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="mt-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <form onSubmit={handlePreferencesSubmit} className="space-y-6">
              <h2 className="text-xl font-bold text-dark-navy mb-6">
                Email Notifications
              </h2>

              <div className="space-y-6">
                {/* Daily Selections */}
                <div className="flex items-center justify-between py-4 border-b border-gray-200">
                  <div className="flex-1">
                    <h3 className="font-semibold text-dark-navy mb-1">
                      Daily Selections
                    </h3>
                    <p className="text-sm text-dark-navy/70">
                      Receive an email when new selections are posted each day.
                    </p>
                  </div>
                  <Switch
                    checked={emailPreferences.dailySelections}
                    onCheckedChange={(checked) =>
                      setEmailPreferences({
                        ...emailPreferences,
                        dailySelections: checked,
                      })
                    }
                  />
                </div>

                {/* Results Updates */}
                <div className="flex items-center justify-between py-4 border-b border-gray-200">
                  <div className="flex-1">
                    <h3 className="font-semibold text-dark-navy mb-1">
                      Results Updates
                    </h3>
                    <p className="text-sm text-dark-navy/70">
                      Get notified when race results are updated.
                    </p>
                  </div>
                  <Switch
                    checked={emailPreferences.resultsUpdates}
                    onCheckedChange={(checked) =>
                      setEmailPreferences({
                        ...emailPreferences,
                        resultsUpdates: checked,
                      })
                    }
                  />
                </div>

                {/* Monthly Performance Report */}
                <div className="flex items-center justify-between py-4 border-b border-gray-200">
                  <div className="flex-1">
                    <h3 className="font-semibold text-dark-navy mb-1">
                      Monthly Performance Report
                    </h3>
                    <p className="text-sm text-dark-navy/70">
                      Receive a monthly summary of your system performance.
                    </p>
                  </div>
                  <Switch
                    checked={emailPreferences.monthlyPerformanceReport}
                    onCheckedChange={(checked) =>
                      setEmailPreferences({
                        ...emailPreferences,
                        monthlyPerformanceReport: checked,
                      })
                    }
                  />
                </div>

                {/* System Updates */}
                <div className="flex items-center justify-between py-4 border-b border-gray-200">
                  <div className="flex-1">
                    <h3 className="font-semibold text-dark-navy mb-1">
                      System Updates
                    </h3>
                    <p className="text-sm text-dark-navy/70">
                      Stay informed about system changes and improvements.
                    </p>
                  </div>
                  <Switch
                    checked={emailPreferences.systemUpdates}
                    onCheckedChange={(checked) =>
                      setEmailPreferences({
                        ...emailPreferences,
                        systemUpdates: checked,
                      })
                    }
                  />
                </div>

                {/* Billing Reminders */}
                <div className="flex items-center justify-between py-4 border-b border-gray-200">
                  <div className="flex-1">
                    <h3 className="font-semibold text-dark-navy mb-1">
                      Billing Reminders
                    </h3>
                    <p className="text-sm text-dark-navy/70">
                      Receive reminders about upcoming subscription renewals.
                    </p>
                  </div>
                  <Switch
                    checked={emailPreferences.billingReminders}
                    onCheckedChange={(checked) =>
                      setEmailPreferences({
                        ...emailPreferences,
                        billingReminders: checked,
                      })
                    }
                  />
                </div>

                {/* Marketing Emails */}
                <div className="flex items-center justify-between py-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-dark-navy mb-1">
                      Marketing Emails
                    </h3>
                    <p className="text-sm text-dark-navy/70">
                      Receive updates about new features and special offers.
                    </p>
                  </div>
                  <Switch
                    checked={emailPreferences.marketingEmails}
                    onCheckedChange={(checked) =>
                      setEmailPreferences({
                        ...emailPreferences,
                        marketingEmails: checked,
                      })
                    }
                  />
                </div>
              </div>

              {/* Save Preferences Button */}
              <div className="pt-6">
                <Button
                  type="submit"
                  variant="secondary"
                  className="bg-gold text-dark-navy hover:bg-gold/90"
                  disabled={isSavingPreferences}
                >
                  {isSavingPreferences ? "Saving..." : "Save Preferences"}
                </Button>
              </div>
            </form>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
