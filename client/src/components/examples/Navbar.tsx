import Navbar from '../Navbar';

export default function NavbarExample() {
  return <Navbar onAuthClick={() => console.log('Auth clicked')} />;
}
