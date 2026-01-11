import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { AuthProvider, useAuth } from '../context/AuthContext'

function TestComp() {
    const { authenticated, login, logout, token, user } = useAuth()
    return (
        <div>
            <div>Authenticated: {authenticated ? 'true' : 'false'}</div>
            <div>Token: {token ?? 'null'}</div>
            <div>User: {user ? user.id : 'null'}</div>
            <button onClick={() => login('test-token', { id: 'u1', email: 'u@example.com' })}>Login</button>
            <button onClick={() => logout()}>Logout</button>
        </div>
    )
}

describe('AuthContext', () => {
    beforeEach(() => {
        localStorage.clear()
    })

    it('defaults to unauthenticated and can login/logout', async () => {
        render(
            <AuthProvider>
                <TestComp />
            </AuthProvider>
        )

        expect(screen.getByText(/Authenticated:/)).toHaveTextContent('Authenticated: false')
        expect(screen.getByText(/Token:/)).toHaveTextContent('Token: null')

        fireEvent.click(screen.getByText('Login'))

        expect(localStorage.getItem('token')).toBe('test-token')
        expect(screen.getByText(/Authenticated:/)).toHaveTextContent('Authenticated: true')
        expect(screen.getByText(/Token:/)).toHaveTextContent('Token: test-token')

        fireEvent.click(screen.getByText('Logout'))

        expect(localStorage.getItem('token')).toBeNull()
        expect(screen.getByText(/Authenticated:/)).toHaveTextContent('Authenticated: false')
        expect(screen.getByText(/Token:/)).toHaveTextContent('Token: null')
    })
})
