import { Card } from './ui/card';
import { Button } from './ui/button';
import { 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  FileText,
  Upload,
  ExternalLink,
  Clock
} from 'lucide-react';

const complianceStatus = {
  businessVerification: 'verified',
  kycCompleted: 'verified',
  amlScreening: 'verified',
  taxDocuments: 'pending',
  regulatoryLicense: 'verified'
};

const verifiableCredentials = [
  {
    id: '1',
    type: 'Business Verification',
    issuer: 'Circle Compliance Network',
    status: 'active',
    issuedDate: '2024-09-15',
    expiryDate: '2025-09-15',
    credentialHash: '0x9a8b7c6d5e4f...'
  },
  {
    id: '2',
    type: 'KYC/AML Certification',
    issuer: 'Regulatory Authority',
    status: 'active',
    issuedDate: '2024-10-01',
    expiryDate: '2025-10-01',
    credentialHash: '0x1a2b3c4d5e6f...'
  },
  {
    id: '3',
    type: 'Payment Service License',
    issuer: 'Financial Conduct Authority',
    status: 'active',
    issuedDate: '2024-08-20',
    expiryDate: '2026-08-20',
    credentialHash: '0x3c4d5e6f7a8b...'
  }
];

const recentActivity = [
  {
    id: '1',
    action: 'KYC verification renewed',
    date: '2024-11-10',
    status: 'completed'
  },
  {
    id: '2',
    action: 'AML screening passed',
    date: '2024-11-08',
    status: 'completed'
  },
  {
    id: '3',
    action: 'Document upload pending',
    date: '2024-11-05',
    status: 'pending'
  }
];

export function Compliance() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-slate-900 mb-2">Compliance</h1>
        <p className="text-slate-600">Manage your on-chain compliance and verifiable credentials</p>
      </div>

      {/* Compliance Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 border-slate-200 bg-gradient-to-br from-green-50 to-white">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <div className="text-2xl text-slate-900">Compliant</div>
              <div className="text-sm text-slate-600">Overall Status</div>
            </div>
          </div>
          <div className="text-sm text-green-700">
            All required verifications completed
          </div>
        </Card>

        <Card className="p-6 border-slate-200 hover:bg-slate-200">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl text-slate-900">3</div>
              <div className="text-sm text-slate-600">Active Credentials</div>
            </div>
          </div>
          <div className="text-sm text-slate-600">
            Verifiable on-chain
          </div>
        </Card>

        <Card className="p-6 border-slate-200 hover:bg-slate-200">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl text-slate-900">98.5%</div>
              <div className="text-sm text-slate-600">Compliance Score</div>
            </div>
          </div>
          <div className="text-sm text-slate-600">
            Last updated: Today
          </div>
        </Card>
      </div>

      {/* Compliance Checklist */}
      <Card className="mb-8 border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-slate-900">Compliance Checklist</h2>
        </div>
        <div className="divide-y divide-slate-200">
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
              <div>
                <div className="text-slate-900 mb-1">Business Verification</div>
                <div className="text-sm text-slate-600">Company details and ownership verified</div>
              </div>
            </div>
            <span className="text-sm text-green-700 bg-green-100 px-3 py-1 rounded-full">Verified</span>
          </div>

          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
              <div>
                <div className="text-slate-900 mb-1">KYC Completed</div>
                <div className="text-sm text-slate-600">Know Your Customer verification complete</div>
              </div>
            </div>
            <span className="text-sm text-green-700 bg-green-100 px-3 py-1 rounded-full">Verified</span>
          </div>

          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
              <div>
                <div className="text-slate-900 mb-1">AML Screening</div>
                <div className="text-sm text-slate-600">Anti-Money Laundering checks passed</div>
              </div>
            </div>
            <span className="text-sm text-green-700 bg-green-100 px-3 py-1 rounded-full">Verified</span>
          </div>

          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <AlertCircle className="w-6 h-6 text-orange-600" />
              <div>
                <div className="text-slate-900 mb-1">Tax Documents</div>
                <div className="text-sm text-slate-600">Annual tax documentation required</div>
              </div>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-md" variant="outline" size="sm">
              <Upload className="w-4 h-4 mr-2" />
              Upload
            </Button>
          </div>

          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
              <div>
                <div className="text-slate-900 mb-1">Regulatory License</div>
                <div className="text-sm text-slate-600">Payment service provider license active</div>
              </div>
            </div>
            <span className="text-sm text-green-700 bg-green-100 px-3 py-1 rounded-full">Active</span>
          </div>
        </div>
      </Card>

      {/* Verifiable Credentials */}
      <Card className="mb-8 border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h2 className="text-slate-900">Verifiable Credentials</h2>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-md" variant="outline" size="sm">
              <Upload className="w-4 h-4 mr-2" />
              Add Credential
            </Button>
          </div>
        </div>
        <div className="divide-y divide-slate-200">
          {verifiableCredentials.map((credential) => (
            <div key={credential.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-slate-900">{credential.type}</h3>
                    <span className="text-xs text-green-700 bg-green-100 px-2 py-1 rounded-full">
                      {credential.status}
                    </span>
                  </div>
                  <div className="text-sm text-slate-600 mb-3">
                    Issued by: {credential.issuer}
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-slate-600 mb-1">Issued Date</div>
                      <div className="text-slate-900">{credential.issuedDate}</div>
                    </div>
                    <div>
                      <div className="text-slate-600 mb-1">Expiry Date</div>
                      <div className="text-slate-900">{credential.expiryDate}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="text-xs text-slate-600 mb-1">Credential Hash</div>
                  <div className="text-sm text-slate-900 font-mono">{credential.credentialHash}</div>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-md" variant="outline" size="sm">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Verify On-Chain
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Recent Activity */}
      <Card className="border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-slate-900">Recent Compliance Activity</h2>
        </div>
        <div className="divide-y divide-slate-200">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-4">
                {activity.status === 'completed' ? (
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
                ) : (
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <Clock className="w-5 h-5 text-orange-600" />
                  </div>
                )}
                <div>
                  <div className="text-slate-900 mb-1">{activity.action}</div>
                  <div className="text-sm text-slate-600">{activity.date}</div>
                </div>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-md"variant="ghost" size="sm">
                View Details
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
