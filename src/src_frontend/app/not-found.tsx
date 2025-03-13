import { Button } from '@/ui/Button'
import { HomeIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
 import Logo from '@/public/assets/logo/ForWebSite-01.svg'
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center bg-gray-100 p-4">
      <Image src={Logo} width={400} height={400} alt='logo'/>
    <h1 className="text-6xl font-bold text-gray-800">404</h1>
    <p className="text-xl text-gray-600 mt-2">Oops! Page not found.</p>
    <p className="text-md text-gray-500 mt-1">
      The page you are looking for doesn’t exist or has been moved.
    </p>
    <Link href="/" passHref>
      <Button className="mt-6 flex items-center gap-2 bg-primary hover:bg-black text-white px-4 py-2 rounded-lg shadow-md">
        <HomeIcon size={18} /> Go Home
      </Button>
    </Link>
  </div>
  )
}