import React from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../layouts/DefaultLayout';

export default function Content() {
    return (
        <DefaultLayout>
            <Breadcrumb pageName='Content' />
            Content Page
        </DefaultLayout>
    )
}
