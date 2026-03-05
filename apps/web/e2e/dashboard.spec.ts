import { test, expect } from '@playwright/test'
import { prisma } from '@/lib/db'

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/fr/auth/signin')
  })

  test('should display sign in form', async ({ page }) => {
    await expect(page.locator('input[name="email"]')).toBeVisible()
    await expect(page.locator('input[name="password"]')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeVisible()
  })

  test('should show error on invalid credentials', async ({ page }) => {
    await page.fill('input[name="email"]', 'invalid@example.com')
    await page.fill('input[name="password"]', 'wrongpassword')
    await page.click('button[type="submit"]')
    
    await expect(page.locator('.text-red-600')).toBeVisible()
  })

  test('should redirect parent to parent dashboard after login', async ({ page }) => {
    await page.fill('input[name="email"]', 'parent@demo.com')
    await page.fill('input[name="password"]', 'password123')
    await page.selectOption('select[name="role"]', 'PARENT')
    await page.click('button[type="submit"]')
    
    await expect(page).toHaveURL(/.*dashboard\/parent/)
    await expect(page.locator('text=Dashboard Parent')).toBeVisible()
  })

  test('should redirect teacher to teacher dashboard after login', async ({ page }) => {
    await page.fill('input[name="email"]', 'teacher@demo.com')
    await page.fill('input[name="password"]', 'password123')
    await page.selectOption('select[name="role"]', 'TEACHER')
    await page.click('button[type="submit"]')
    
    await expect(page).toHaveURL(/.*dashboard\/teacher/)
    await expect(page.locator('text=Dashboard Enseignant')).toBeVisible()
  })

  test('should protect routes without authentication', async ({ page }) => {
    await page.goto('/fr/dashboard/parent')
    await expect(page).toHaveURL(/.*auth\/signin/)
  })
})

test.describe('Parent Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/fr/auth/signin')
    await page.fill('input[name="email"]', 'parent@demo.com')
    await page.fill('input[name="password"]', 'password123')
    await page.selectOption('select[name="role"]', 'PARENT')
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL(/.*dashboard\/parent/)
  })

  test('should display parent dashboard stats', async ({ page }) => {
    await expect(page.locator('text=Progression globale')).toBeVisible()
    await expect(page.locator('text=Exercices complétés')).toBeVisible()
  })

  test('should display children list', async ({ page }) => {
    await expect(page.locator('text=Mes Enfants')).toBeVisible()
  })

  test('should not access teacher dashboard', async ({ page }) => {
    await page.goto('/fr/dashboard/teacher')
    await expect(page.locator('text=Accès non autorisé')).toBeVisible()
  })
})

test.describe('Teacher Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/fr/auth/signin')
    await page.fill('input[name="email"]', 'teacher@demo.com')
    await page.fill('input[name="password"]', 'password123')
    await page.selectOption('select[name="role"]', 'TEACHER')
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL(/.*dashboard\/teacher/)
  })

  test('should display teacher dashboard stats', async ({ page }) => {
    await expect(page.locator('text=Mes Classes')).toBeVisible()
    await expect(page.locator('text=Élèves actifs')).toBeVisible()
  })

  test('should access exercise creation', async ({ page }) => {
    await page.click('text=Créer un exercice')
    await expect(page.locator('text=Nouvel exercice')).toBeVisible()
  })
})

test.describe('NGO Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/fr/auth/signin')
    await page.fill('input[name="email"]', 'ngo@demo.com')
    await page.fill('input[name="password"]', 'password123')
    await page.selectOption('select[name="role"]', 'NGO_ADMIN')
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL(/.*dashboard\/ngo/)
  })

  test('should display impact KPIs', async ({ page }) => {
    await expect(page.locator('text=KPIs d\'Impact')).toBeVisible()
    await expect(page.locator('text=Bénéficiaires actifs')).toBeVisible()
  })
})

test.describe('Admin Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/fr/auth/signin')
    await page.fill('input[name="email"]', 'admin@demo.com')
    await page.fill('input[name="password"]', 'password123')
    await page.selectOption('select[name="role"]', 'ORG_ADMIN')
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL(/.*dashboard\/admin/)
  })

  test('should display admin dashboard', async ({ page }) => {
    await expect(page.locator('text=Portail National Administration')).toBeVisible()
    await expect(page.locator('text=Utilisateurs totaux')).toBeVisible()
  })
})

test.describe('Theme Toggle', () => {
  test('should toggle between light and dark mode', async ({ page }) => {
    await page.goto('/fr/auth/signin')
    
    // Click theme toggle
    await page.click('[aria-label="Changer le thème"]')
    await page.click('text=Sombre')
    
    // Check if dark class is applied
    await expect(page.locator('html')).toHaveClass(/dark/)
    
    // Toggle back to light
    await page.click('[aria-label="Changer le thème"]')
    await page.click('text=Clair')
    
    await expect(page.locator('html')).not.toHaveClass(/dark/)
  })
})

test.describe('Notifications', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/fr/auth/signin')
    await page.fill('input[name="email"]', 'parent@demo.com')
    await page.fill('input[name="password"]', 'password123')
    await page.click('button[type="submit"]')
  })

  test('should display notification bell', async ({ page }) => {
    await expect(page.locator('[aria-label="Notifications"]')).toBeVisible()
  })

  test('should open notification panel on click', async ({ page }) => {
    await page.click('[aria-label="Notifications"]')
    await expect(page.locator('text=Notifications')).toBeVisible()
  })
})

test.describe('Internationalization', () => {
  test('should switch language', async ({ page }) => {
    await page.goto('/fr/auth/signin')
    await expect(page.locator('text=Connexion')).toBeVisible()
    
    // Switch to English
    await page.goto('/en/auth/signin')
    await expect(page.locator('text=Sign In')).toBeVisible()
  })

  test('should maintain locale across navigation', async ({ page }) => {
    await page.goto('/fr/auth/signin')
    await page.fill('input[name="email"]', 'parent@demo.com')
    await page.fill('input[name="password"]', 'password123')
    await page.click('button[type="submit"]')
    
    await expect(page).toHaveURL(/\/fr\/dashboard/)
  })
})

test.describe('Responsive Design', () => {
  test('should display correctly on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/fr/auth/signin')
    
    await expect(page.locator('input[name="email"]')).toBeVisible()
    await expect(page.locator('input[name="password"]')).toBeVisible()
  })

  test('should display correctly on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.goto('/fr/auth/signin')
    
    await expect(page.locator('input[name="email"]')).toBeVisible()
  })

  test('should display correctly on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.goto('/fr/auth/signin')
    
    await expect(page.locator('input[name="email"]')).toBeVisible()
  })
})

test.describe('Accessibility', () => {
  test('should have no accessibility violations on signin page', async ({ page }) => {
    await page.goto('/fr/auth/signin')
    
    // Basic accessibility checks
    await expect(page.locator('input[name="email"]')).toHaveAttribute('type', 'email')
    await expect(page.locator('input[name="password"]')).toHaveAttribute('type', 'password')
  })

  test('should support keyboard navigation', async ({ page }) => {
    await page.goto('/fr/auth/signin')
    
    await page.keyboard.press('Tab')
    await expect(page.locator('input[name="email"]')).toBeFocused()
    
    await page.keyboard.press('Tab')
    await expect(page.locator('input[name="password"]')).toBeFocused()
  })
})
