import * as React from 'react';
import HomePage from '../ui-components/HomePage';
import SearchPage from '../ui-components/SearchPage';
import AIPage from '../ui-components/AIPage';

export default function CombinedHome() {
    return (
        <>
            <HomePage />
            <SearchPage />
            <AIPage />
        </>
    );
}