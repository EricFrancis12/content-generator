import React from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../layouts/DefaultLayout';

export default function Files() {
    return (
        <DefaultLayout>
            <Breadcrumb pageName='Files' />
            Files Page
        </DefaultLayout>
    )
}