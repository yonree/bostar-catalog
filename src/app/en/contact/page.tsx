export default function EnContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-xl font-semibold text-neutral-800 mb-2">Contact Us</h1>
      <p className="text-sm text-neutral-500 mb-8">Reach out to our sales team for product inquiries and technical support</p>

      <div className="bg-white rounded-xl border border-neutral-100 p-6 space-y-6">
        <div>
          <h3 className="text-sm font-medium text-neutral-800 mb-1">Company</h3>
          <p className="text-sm text-neutral-600">BOSTAR Electrostatic Spraying Equipment Co., Ltd.</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-neutral-800 mb-1">Address</h3>
          <p className="text-sm text-neutral-600">No. 88, Industrial Avenue, Foshan City, Guangdong Province, China</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-neutral-800 mb-1">Phone</h3>
          <p className="text-sm text-neutral-600">+86-757-8888-8888</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-neutral-800 mb-1">Email</h3>
          <p className="text-sm text-neutral-600">info@bostar-spray.com</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-neutral-800 mb-1">Business Hours</h3>
          <p className="text-sm text-neutral-600">Monday to Friday, 8:30 AM - 5:30 PM (China Standard Time)</p>
        </div>
      </div>
    </div>
  );
}
