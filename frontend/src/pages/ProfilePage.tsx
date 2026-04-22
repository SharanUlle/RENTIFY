import { useState, useRef } from 'react'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Camera, Save, Lock, User } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { authService } from '../services'
import styles from './ProfilePage.module.css'

export default function ProfilePage() {
  const { user, login } = useAuthStore()
  const fileRef = useRef<HTMLInputElement>(null)

  const [name, setName] = useState(user?.name || '')
  const [phone, setPhone] = useState((user as any)?.phone || '')
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const profileMutation = useMutation({
    mutationFn: async () => {
      const fd = new FormData()
      fd.append('name', name.trim())
      fd.append('phone', phone.trim())
      if (avatarFile) fd.append('avatar', avatarFile)
      return authService.updateProfile(fd)
    },
    onSuccess: (updatedUser) => {
      // Sync zustand store with updated user
      useAuthStore.setState({ user: updatedUser })
      toast.success('Profile updated!')
      setAvatarFile(null)
      setAvatarPreview(null)
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Update failed'),
  })

  const passwordMutation = useMutation({
    mutationFn: () => authService.changePassword({ currentPassword, newPassword }),
    onSuccess: () => {
      toast.success('Password changed!')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed to change password'),
  })

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) { toast.error('Passwords do not match'); return }
    if (newPassword.length < 6) { toast.error('New password must be at least 6 characters'); return }
    passwordMutation.mutate()
  }

  const displayAvatar = avatarPreview || user?.avatar_url

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Profile Settings</h1>

        <div className={styles.grid}>
          {/* Left: profile info */}
          <div className={`card ${styles.card}`}>
            <h2 className={styles.sectionTitle}><User size={18} /> Account Info</h2>

            {/* Avatar */}
            <div className={styles.avatarSection}>
              <div className={styles.avatarWrap} onClick={() => fileRef.current?.click()}>
                {displayAvatar
                  ? <img src={displayAvatar} alt={user?.name} className={styles.avatar} />
                  : <div className={styles.avatarFallback}>{user?.name?.[0]?.toUpperCase()}</div>
                }
                <div className={styles.avatarOverlay}><Camera size={18} /></div>
              </div>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />
              <p className={styles.avatarHint}>Click to change avatar</p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); profileMutation.mutate() }} className={styles.form}>
              <div className={styles.field}>
                <label>Full Name</label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" required />
              </div>
              <div className={styles.field}>
                <label>Email</label>
                <input value={user?.email || ''} disabled className={styles.disabled} />
                <span className={styles.hint}>Email cannot be changed</span>
              </div>
              <div className={styles.field}>
                <label>Phone</label>
                <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 9876543210" />
              </div>
              <div className={styles.field}>
                <label>Account Type</label>
                <input value={user?.role || ''} disabled className={styles.disabled} />
              </div>
              <button type="submit" className="btn btn-primary" disabled={profileMutation.isPending}>
                {profileMutation.isPending ? <span className="spinner" /> : <><Save size={16} /> Save Changes</>}
              </button>
            </form>
          </div>

          {/* Right: change password */}
          <div className={`card ${styles.card}`}>
            <h2 className={styles.sectionTitle}><Lock size={18} /> Change Password</h2>
            <form onSubmit={handlePasswordSubmit} className={styles.form}>
              <div className={styles.field}>
                <label>Current Password</label>
                <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required />
              </div>
              <div className={styles.field}>
                <label>New Password</label>
                <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
              </div>
              <div className={styles.field}>
                <label>Confirm New Password</label>
                <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
              </div>
              <button type="submit" className="btn btn-primary" disabled={passwordMutation.isPending}>
                {passwordMutation.isPending ? <span className="spinner" /> : <><Lock size={16} /> Change Password</>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
