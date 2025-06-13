import { Home, Map, Mailbox, Flag } from "lucide-react";

const DetailItem = ({ icon, label, value, iconColor }) => {
  const Icon = icon;
  return (
    <div className="bg-gray-50 p-3 rounded-lg flex items-center space-x-3">
      <Icon className={`w-5 h-5 ${iconColor}`} />
      <div>
        <div className="text-xs text-gray-500 uppercase tracking-wide">
          {label}
        </div>
        <div className="font-semibold text-gray-800">{value || "N/A"}</div>
      </div>
    </div>
  );
};

export default function AddressDetails({ address }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
      <DetailItem
        icon={Home}
        label="Town/Village"
        value={address.county}
        iconColor="text-gray-600"
      />
      <DetailItem
        icon={Map}
        label="District"
        value={address.state_district}
        iconColor="text-green-600"
      />
      <DetailItem
        icon={Mailbox}
        label="Pin Code"
        value={address.postcode}
        iconColor="text-red-600"
      />
      <DetailItem
        icon={Flag}
        label="State"
        value={address.state}
        iconColor="text-blue-600"
      />
    </div>
  );
}
