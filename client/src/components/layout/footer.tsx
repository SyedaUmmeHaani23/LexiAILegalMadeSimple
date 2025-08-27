export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2" data-testid="text-footer-developer">
            Developed by <span className="font-medium text-gray-900">Syeda Umme Haani</span>
          </p>
          <p className="text-sm text-gray-500" data-testid="text-footer-contact">
            Contact: <a href="tel:+917204409926" className="text-primary-600 hover:text-primary-700">+91 7204409926</a> | 
            Email: <a href="mailto:syedaummehaani23@gmail.com" className="text-primary-600 hover:text-primary-700 ml-1">syedaummehaani23@gmail.com</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
