import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Building2, Bell, Shield, Webhook, Save, Key } from "lucide-react";
import { toast } from "sonner";

export function SettingsBusiness() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [payoutAlerts, setPayoutAlerts] = useState(true);
  const [complianceAlerts, setComplianceAlerts] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  const handleSave = () => {
    toast.success("Settings saved successfully");
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-slate-900 mb-2">Settings</h1>
        <p className="text-slate-600">Manage your account and application preferences</p>
      </div>

      <Tabs defaultValue="company" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-slate-200">
          <TabsTrigger 
            value="company"
            className="
              hover:bg-slate-300
              data-[state=active]:bg-white
              data-[state=active]:text-slate-900
              transition-colors
            "
          >
            Company
          </TabsTrigger>

          <TabsTrigger 
            value="notifications"
            className="
              hover:bg-slate-300
              data-[state=active]:bg-white
              data-[state=active]:text-slate-900
              transition-colors
            "
          >
            Notifications
          </TabsTrigger>

          <TabsTrigger 
            value="security"
            className="
              hover:bg-slate-300
              data-[state=active]:bg-white
              data-[state=active]:text-slate-900
              transition-colors
            "
          >
            Security
          </TabsTrigger>

          <TabsTrigger 
            value="api"
            className="
              hover:bg-slate-300
              data-[state=active]:bg-white
              data-[state=active]:text-slate-900
              transition-colors
            "
          >
            API & Webhooks
          </TabsTrigger>
        </TabsList>

        {/* Company Settings */}
        <TabsContent value="company">
          <Card className="p-6 border-slate-200">
            <div className="flex items-center gap-3 mb-6">
              <Building2 className="w-6 h-6 text-blue-600" />
              <h2 className="text-slate-900">Company Information</h2>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Company Name</Label>
                  <Input id="company-name" defaultValue="Acme Corporation" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-email">Company Email</Label>
                  <Input id="company-email" type="email" defaultValue="admin@acme.com" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input id="country" defaultValue="United States" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="registration">Registration Number</Label>
                  <Input id="registration" defaultValue="123456789" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Business Address</Label>
                <Input id="address" defaultValue="123 Business Street, San Francisco, CA 94105" />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" defaultValue="+1 (555) 123-4567" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input id="website" defaultValue="https://acme.com" />
                </div>
              </div>

              <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white rounded-md">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card className="p-6 border-slate-200">
            <div className="flex items-center gap-3 mb-6">
              <Bell className="w-6 h-6 text-blue-600" />
              <h2 className="text-slate-900">Notification Preferences</h2>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between py-4 border-b border-slate-200">
                <div className="space-y-1">
                  <div className="text-slate-900">Email Notifications</div>
                  <div className="text-sm text-slate-600">
                    Receive email updates about your account
                  </div>
                </div>
                <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
              </div>

              <div className="flex items-center justify-between py-4 border-b border-slate-200">
                <div className="space-y-1">
                  <div className="text-slate-900">Payout Alerts</div>
                  <div className="text-sm text-slate-600">
                    Get notified when payouts are sent or received
                  </div>
                </div>
                <Switch checked={payoutAlerts} onCheckedChange={setPayoutAlerts} />
              </div>

              <div className="flex items-center justify-between py-4 border-b border-slate-200">
                <div className="space-y-1">
                  <div className="text-slate-900">Compliance Alerts</div>
                  <div className="text-sm text-slate-600">
                    Important compliance and verification updates
                  </div>
                </div>
                <Switch checked={complianceAlerts} onCheckedChange={setComplianceAlerts} />
              </div>

              <div className="flex items-center justify-between py-4 border-b border-slate-200">
                <div className="space-y-1">
                  <div className="text-slate-900">Low Balance Warnings</div>
                  <div className="text-sm text-slate-600">
                    Alert when wallet balance falls below threshold
                  </div>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between py-4">
                <div className="space-y-1">
                  <div className="text-slate-900">Weekly Summary</div>
                  <div className="text-sm text-slate-600">
                    Receive a weekly report of your activity
                  </div>
                </div>
                <Switch defaultChecked />
              </div>

              <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white rounded-md">
                <Save className="w-4 h-4 mr-2" />
                Save Preferences
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
          <Card className="p-6 border-slate-200">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-6 h-6 text-blue-600" />
              <h2 className="text-slate-900">Security Settings</h2>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between py-4 border-b border-slate-200">
                <div className="space-y-1">
                  <div className="text-slate-900">Two-Factor Authentication</div>
                  <div className="text-sm text-slate-600">
                    Add an extra layer of security to your account
                  </div>
                </div>
                <Switch checked={twoFactorEnabled} onCheckedChange={setTwoFactorEnabled} />
              </div>

              <div className="py-4 border-b border-slate-200">
                <div className="space-y-1 mb-4">
                  <div className="text-slate-900">Change Password</div>
                  <div className="text-sm text-slate-600">Update your account password</div>
                </div>
                <Button className = "rounded-md bg-blue-600 hover:bg-blue-700 text-white" variant="outline">Change Password</Button>
              </div>

              <div className="py-4 border-b border-slate-200">
                <div className="space-y-1 mb-4">
                  <div className="text-slate-900">Active Sessions</div>
                  <div className="text-sm text-slate-600">Manage your active login sessions</div>
                </div>
                <div className="space-y-3">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-slate-900">Current Session</div>
                        <div className="text-xs text-slate-600">
                          San Francisco, CA • Chrome on macOS
                        </div>
                      </div>
                      <span className="text-xs text-green-700 bg-green-100 px-2 py-1 rounded-full">
                        Active
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="py-4">
                <div className="space-y-1 mb-4">
                  <div className="text-slate-900">Wallet Security</div>
                  <div className="text-sm text-slate-600">
                    Manage wallet permissions and security settings
                  </div>
                </div>
                <Button className = "rounded-md bg-blue-600 hover:bg-blue-700 text-white" variant="outline">Configure Wallet Security</Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* API & Webhooks */}
        <TabsContent value="api">
          <Card className="p-6 border-slate-200 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <Key className="w-6 h-6 text-blue-600" />
              <h2 className="text-slate-900">API Keys</h2>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="text-sm text-slate-900">Production API Key</div>
                    <div className="text-xs text-slate-600">Created on Oct 15, 2024</div>
                  </div>
                  <Button className="rounded-md bg-blue-600 hover:bg-blue-700 text-white" variant="outline" size="sm">
                    Regenerate
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <code className="flex-1 p-2 bg-white border border-slate-200 rounded text-xs font-mono">
                    pk_live_51H7H7H7H7H7H7H7H7H7H7H7H7H7H7H7H
                  </code>
                  <Button className="rounded-md bg-blue-600 hover:bg-blue-700 text-white" variant="outline" size="sm">
                    Copy
                  </Button>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="text-sm text-slate-900">Test API Key</div>
                    <div className="text-xs text-slate-600">For development and testing</div>
                  </div>
                  <Button className="rounded-md bg-blue-600 hover:bg-blue-700 text-white" variant="outline" size="sm">
                    Regenerate
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <code className="flex-1 p-2 bg-white border border-slate-200 rounded text-xs font-mono">
                    pk_test_51H7H7H7H7H7H7H7H7H7H7H7H7H7H7H7H
                  </code>
                  <Button className="rounded-md bg-blue-600 hover:bg-blue-700 text-white" variant="outline" size="sm">
                    Copy
                  </Button>
                </div>
              </div>

              <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-md">
                <Key className="w-4 h-4 mr-2" />
                Create New API Key
              </Button>
            </div>
          </Card>

          <Card className="p-6 border-slate-200">
            <div className="flex items-center gap-3 mb-6">
              <Webhook className="w-6 h-6 text-blue-600" />
              <h2 className="text-slate-900">Webhooks</h2>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="text-sm text-slate-900">Payout Events</div>
                    <div className="text-xs text-slate-600">
                      https://api.acme.com/webhooks/payouts
                    </div>
                  </div>
                  <span className="text-xs text-green-700 bg-green-100 px-2 py-1 rounded-full">
                    Active
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button className="rounded-md bg-blue-600 hover:bg-blue-700 text-white" variant="outline" size="sm">
                    Edit
                  </Button>
                  <Button className="rounded-md bg-blue-600 hover:bg-blue-700 text-white" variant="outline" size="sm">
                    Test
                  </Button>
                  <Button className="rounded-md bg-blue-600 hover:bg-blue-700 text-white" variant="outline" size="sm">
                    Delete
                  </Button>
                </div>
              </div>

              <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-mg">
                <Webhook className="w-4 h-4 mr-2" />
                Add Webhook Endpoint
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
