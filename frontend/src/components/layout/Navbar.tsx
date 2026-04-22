import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ShoppingBag, PlusCircle, User, LogOut, Home, Package, ChevronDown, Settings } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import styles from './Navbar.module.css'

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const [dropOpen, setDropOpen] = useState(false)
  const dropRef = useRef<HTMLDivElement>(null)

  const handleLogout = () => {
    logout()
    setDropOpen(false)
    navigate('/login')
  }

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/')

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setDropOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Close dropdown on route change
  useEffect(() => { setDropOpen(false) }, [location.pathname])

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logo}>
          <ShoppingBag size={22} />
          <span>Rentify</span>
        </Link>

        <div className={styles.links}>
          <Link to="/" className={isActive('/') && location.pathname === '/' ? styles.active : ''}>
            <Home size={16} /> Browse
          </Link>
          {isAuthenticated && (
            <>
              <Link to="/my-rentals" className={isActive('/my-rentals') ? styles.active : ''}>
                <Package size={16} /> My Rentals
              </Link>
              <Link to="/my-listings" className={isActive('/my-listings') ? styles.active : ''}>
                <ShoppingBag size={16} /> My Listings
              </Link>
            </>
          )}
        </div>

        <div className={styles.actions}>
          {isAuthenticated ? (
            <>
              <Link to="/list-product" className="btn btn-primary btn-sm">
                <PlusCircle size={16} /> List Item
              </Link>

              {/* Avatar + Dropdown */}
              <div className={styles.userMenu} ref={dropRef}>
                <button
                  className={styles.avatarBtn}
                  onClick={() => setDropOpen(v => !v)}
                  aria-expanded={dropOpen}
                >
                  {user?.avatar_url
                    ? <img src={user.avatar_url} alt={user.name} className={styles.avatar} />
                    : <div className={styles.avatarFallback}>{user?.name?.[0]?.toUpperCase()}</div>
                  }
                  <ChevronDown size={14} className={`${styles.chevron} ${dropOpen ? styles.chevronOpen : ''}`} />
                </button>

                {dropOpen && (
                  <div className={styles.dropdown}>
                    {/* User info */}
                    <div className={styles.dropHeader}>
                      <div className={styles.dropAvatar}>
                        {user?.avatar_url
                          ? <img src={user.avatar_url} alt={user.name} />
                          : <div className={styles.dropAvatarFallback}>{user?.name?.[0]?.toUpperCase()}</div>
                        }
                      </div>
                      <div>
                        <div className={styles.dropName}>{user?.name}</div>
                        <div className={styles.dropEmail}>{user?.email}</div>
                      </div>
                    </div>
                    <div className={styles.dropDivider} />
                    <Link to="/my-rentals" className={styles.dropItem}>
                      <Package size={15} /> My Rentals
                    </Link>
                    <Link to="/my-listings" className={styles.dropItem}>
                      <ShoppingBag size={15} /> My Listings
                    </Link>
                    <Link to="/list-product" className={styles.dropItem}>
                      <PlusCircle size={15} /> List an Item
                    </Link>
                    <Link to="/profile" className={styles.dropItem}>
                      <Settings size={15} /> Profile Settings
                    </Link>
                    <div className={styles.dropDivider} />
                    <button className={`${styles.dropItem} ${styles.dropLogout}`} onClick={handleLogout}>
                      <LogOut size={15} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
