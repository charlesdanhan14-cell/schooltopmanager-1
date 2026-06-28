import { Establishment } from '../types';
import { cn } from '../lib/utils';

interface Props {
  establishment: Establishment;
  className?: string;
}

export function OfficialHeader({ establishment, className }: Props) {
  const { headerConfig, logos, address } = establishment;

  const RepublicSection = () => (
    <div className="text-center space-y-1">
      <p className="font-bold text-sm uppercase tracking-widest">{headerConfig.republic}</p>
      <p className="text-[10px] italic font-medium">{headerConfig.motto}</p>
      <div className="w-16 h-0.5 bg-black mx-auto"></div>
    </div>
  );

  const SchoolInfoSection = () => (
    <div className="text-[10px] leading-relaxed">
      <p className="font-bold uppercase text-xs">{establishment.name}</p>
      <p><span className="font-semibold">Slogan:</span> {establishment.slogan}</p>
      <p><span className="font-semibold">Code:</span> {establishment.code}</p>
      <p><span className="font-semibold">Autorisation:</span> {establishment.authNumber}</p>
      <p><span className="font-semibold">Tel:</span> {address.phone} | <span className="font-semibold">Email:</span> {address.email}</p>
    </div>
  );

  const LogoSection = () => (
    <div className="flex justify-center">
      {logos.primary ? (
        <img src={logos.primary} alt="Logo" className="h-16 w-auto object-contain" />
      ) : (
        <div className="h-16 w-16 bg-slate-100 rounded flex items-center justify-center text-[10px] border-2 border-dashed">LOGO</div>
      )}
    </div>
  );

  return (
    <div className={cn("p-4 border-b-2 border-black grid grid-cols-3 items-center gap-4 bg-white", className)}>
      <div className={cn(
        headerConfig.logoPosition === 'left' ? 'order-1' : headerConfig.alignment === 'left' ? 'order-2' : 'order-3'
      )}>
        {headerConfig.logoPosition === 'left' ? <LogoSection /> : headerConfig.infoPosition === 'left' ? <SchoolInfoSection /> : <RepublicSection />}
      </div>

      <div className={cn(
        'order-2',
        headerConfig.alignment === 'center' ? 'flex justify-center' : ''
      )}>
        {headerConfig.alignment === 'center' ? <RepublicSection /> : headerConfig.logoPosition === 'center' ? <LogoSection /> : <SchoolInfoSection />}
      </div>

      <div className={cn(
        headerConfig.infoPosition === 'right' ? 'order-3' : 'order-1'
      )}>
        {headerConfig.infoPosition === 'right' ? <SchoolInfoSection /> : headerConfig.logoPosition === 'right' ? <LogoSection /> : <RepublicSection />}
      </div>
    </div>
  );
}