import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import App from '../pages/_app'

let push = vi.fn()
let events = { on: vi.fn(), off: vi.fn() }
let pathname = '/profile'

vi.mock('next/router', () => ({
    useRouter: () => ({
        pathname,
        push,
        events,
    }),
}))

describe('AuthGuard', () => {
    beforeEach(() => {
        push = vi.fn()
        events = { on: vi.fn(), off: vi.fn() }
        localStorage.clear()
    })

    it('redirects unauthenticated users to /login', async () => {
        pathname = '/profile'
        render(<App Component={() => <div>private</div>} pageProps={{}} />)

        await waitFor(() => {
            expect(push).toHaveBeenCalledWith('/login')
        })
    })

    it('does not redirect when authenticated', async () => {
        localStorage.setItem('token', 'abc')
        pathname = '/profile'
        render(<App Component={() => <div>private</div>} pageProps={{}} />)

        // allow effects to run
        await new Promise((r) => setTimeout(r, 10))
        expect(push).not.toHaveBeenCalled()
    })
})
