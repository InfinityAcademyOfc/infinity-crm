
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, Settings, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

export function UserMenu() {
  const { user, profile, companyProfile, signOut, isCompanyAccount } = useAuth();
  
  const getUserInitials = () => {
    const currentProfile = isCompanyAccount ? companyProfile : profile;
    const name = currentProfile?.name || user?.user_metadata?.name || 'U';
    
    const nameParts = name.split(' ');
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
    
    return `${nameParts[0].charAt(0)}${nameParts[nameParts.length - 1].charAt(0)}`.toUpperCase();
  };

  const handleSignOut = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await signOut();
    } catch (error) {
      toast.error("Erro ao fazer logout. Tente novamente.");
    }
  };

  const getAvatarUrl = () => {
    const currentProfile = isCompanyAccount ? companyProfile : profile;
    return currentProfile?.avatar_url || user?.user_metadata?.avatar_url;
  };

  const getDisplayName = () => {
    const currentProfile = isCompanyAccount ? companyProfile : profile;
    return currentProfile?.name || user?.user_metadata?.name || 'Usuário';
  };

  const getAccountType = () => {
    return isCompanyAccount ? 'Empresa' : 'Colaborador';
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar>
            <AvatarImage src={getAvatarUrl()} />
            <AvatarFallback>{getUserInitials()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{getDisplayName()}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {getAccountType()}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link to="/app/user-settings" className="cursor-pointer w-full">
              <User className="mr-2 h-4 w-4" />
              <span>Perfil</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/app/settings" className="cursor-pointer w-full">
              <Settings className="mr-2 h-4 w-4" />
              <span>Configurações</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={handleSignOut}
          className="cursor-pointer text-red-500 hover:text-red-500 focus:text-red-500"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
