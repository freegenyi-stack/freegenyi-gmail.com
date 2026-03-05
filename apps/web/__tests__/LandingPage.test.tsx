import { render, screen } from '@testing-library/react'
import LandingPage from '@/components/landing/LandingPage'

// Mock translations
jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}))

// Mock child components to avoid testing their implementation details here
jest.mock('@/components/landing/Hero', () => ({ Hero: () => <div data-testid="hero">Hero</div> }))
jest.mock('@/components/landing/Values', () => ({ Values: () => <div data-testid="values">Values</div> }))
jest.mock('@/components/landing/ParentsSection', () => ({ ParentsSection: () => <div data-testid="parents">ParentsSection</div> }))
jest.mock('@/components/landing/SchoolsSection', () => ({ SchoolsSection: () => <div data-testid="schools">SchoolsSection</div> }))
jest.mock('@/components/landing/OngsSection', () => ({ OngsSection: () => <div data-testid="ongs">OngsSection</div> }))
jest.mock('@/components/landing/PricingSection', () => ({ PricingSection: () => <div data-testid="pricing">PricingSection</div> }))
jest.mock('@/components/landing/Publics', () => ({ Publics: () => <div data-testid="publics">Publics</div> }))
jest.mock('@/components/landing/FAQ', () => ({ FAQ: () => <div data-testid="faq">FAQ</div> }))

describe('Landing Page', () => {
    it('renders all sections', () => {
        render(<LandingPage />)

        expect(screen.getByTestId('hero')).toBeInTheDocument()
        expect(screen.getByTestId('values')).toBeInTheDocument()
        expect(screen.getByTestId('parents')).toBeInTheDocument()
        expect(screen.getByTestId('schools')).toBeInTheDocument()
        expect(screen.getByTestId('ongs')).toBeInTheDocument()
        expect(screen.getByTestId('pricing')).toBeInTheDocument()
        expect(screen.getByTestId('publics')).toBeInTheDocument()
        expect(screen.getByTestId('faq')).toBeInTheDocument()
    })
})
