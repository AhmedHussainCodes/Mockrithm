export default function MaintenanceLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-black text-white min-h-screen flex items-center justify-center">
      {children}
    </div>
  );
}
