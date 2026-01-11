import '@testing-library/jest-dom'

// Mock next/link to simply render children to avoid Next.js Link behaviour in tests
import React from 'react'

vi.mock('next/link', () => ({
    // eslint-disable-next-line react/display-name
    default: (props: any) => React.createElement('a', props, props.children),
}))
