import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Scale, 
  Home, 
  Upload, 
  LayoutDashboard, 
  MessageCircle, 
  BookOpen, 
  User, 
  Settings, 
  LogOut,
  Menu,
  X
} from "lucide-react";
import { Link } from "wouter";
import { LanguageSelector } from "@/components/ui/language-selector";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentLanguage, setLanguage, t } = useLanguage();

  const navigation = [
    { name: t('nav.home', 'Home'), href: "/", icon: Home },
    { name: t('nav.upload', 'Upload'), href: "/upload", icon: Upload },
    { name: t('nav.dashboard', 'Dashboard'), href: "/dashboard", icon: LayoutDashboard },
    { name: t('nav.chatbot', 'Chatbot'), href: "/chatbot", icon: MessageCircle },
    { name: t('nav.glossary', 'Glossary'), href: "/glossary", icon: BookOpen },
  ];

  const getUserInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    } else if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return "U";
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="bg-card shadow-material border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-card/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-glow transition-all duration-300 group-hover:shadow-glow-lg">
                <Scale className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">LexiAI</span>
              <span className="text-sm text-muted-foreground hidden sm:block">Legal Made Simple</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => {
              const isActive = location === item.href;
              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    className={`btn-animate flex items-center space-x-2 ${
                      isActive 
                        ? "bg-primary text-primary-foreground shadow-glow" 
                        : "text-muted-foreground hover:text-primary hover:bg-accent"
                    }`}
                    data-testid={`nav-${item.name.toLowerCase()}`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* User Profile & Mobile Menu */}
          <div className="flex items-center space-x-3">
            {/* Language Selector */}
            <LanguageSelector 
              selectedLanguage={currentLanguage}
              onLanguageChange={setLanguage}
              className="hidden sm:flex"
            />
            
            {isAuthenticated ? (
              <>
                {/* User Info - Desktop */}
                <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600">
                  <User className="h-4 w-4" />
                  <span data-testid="text-user-display">
                    {user?.firstName && user?.lastName 
                      ? `${user.firstName} ${user.lastName}`
                      : user?.email || "User"
                    }
                  </span>
                </div>

                {/* User Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0" data-testid="button-user-menu">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.profileImageUrl || undefined} />
                        <AvatarFallback className="text-xs font-semibold bg-primary-100 text-primary-700">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuItem className="flex-col items-start">
                      <div className="font-medium" data-testid="text-dropdown-user-name">
                        {user?.firstName && user?.lastName 
                          ? `${user.firstName} ${user.lastName}`
                          : "User"
                        }
                      </div>
                      <div className="text-xs text-muted-foreground" data-testid="text-dropdown-user-email">
                        {user?.email}
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <Link href="/profile">
                      <DropdownMenuItem data-testid="nav-profile">
                        <User className="mr-2 h-4 w-4" />
                        <span>{t('nav.profile', 'Profile')}</span>
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem disabled>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>{t('common.settings', 'Settings')}</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} data-testid="button-dropdown-logout">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>{t('nav.logout', 'Log out')}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login">
                  <Button variant="ghost" className="btn-animate" data-testid="button-login">
                    {t('nav.login', 'Sign In')}
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="btn-animate bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700" data-testid="button-signup">
                    {t('nav.signup', 'Sign Up')}
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-2">
              {navigation.map((item) => {
                const isActive = location === item.href;
                return (
                  <Link key={item.name} href={item.href}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      className={`w-full justify-start ${
                        isActive 
                          ? "bg-primary-100 text-primary-700" 
                          : "text-gray-700"
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                      data-testid={`mobile-nav-${item.name.toLowerCase()}`}
                    >
                      <item.icon className="h-4 w-4 mr-3" />
                      {item.name}
                    </Button>
                  </Link>
                );
              })}
              
              {/* Mobile Language Selector */}
              <div className="px-3 py-2">
                <LanguageSelector 
                  selectedLanguage={currentLanguage}
                  onLanguageChange={setLanguage}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}