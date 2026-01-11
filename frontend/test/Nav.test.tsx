import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Nav from '../components/Nav'
import { AuthProvider } from '../context/AuthContext'

let push = vi.fn()
let events = { on: vi.fn(), off: vi.fn() }
let pathname = '/'

vi.mock('next/router', () => ({
    useRouter: () => ({ pathname, push, events }),
}))

describe('Nav', () => {
    beforeEach(() => {
        pathname = '/'
        push = vi.fn()
        localStorage.clear()
    })

    it('does not show Me when unauthenticated', () => {
        render(<AuthProvider><Nav /></AuthProvider>)
        expect(screen.queryByText('Me')).toBeNull()
    })

    it('shows Me and navigates to profile when authenticated', async () => {
        localStorage.setItem('token', 'abc')
        localStorage.setItem('user', JSON.stringify({ id: 'u1' }))
        render(<AuthProvider><Nav /></AuthProvider>)
        const button = screen.getByRole('button', { name: /me/i })
        await userEvent.click(button)

        const profile = screen.getByText('Profile')
        await userEvent.click(profile)

        expect(push).toHaveBeenCalledWith('/profile')
    })
})
