import React, { useState } from 'react';
import StrikethroughInputWithTitle from './StrikethroughInputWithTitle';
import Dropdown from './Dropdown';
import {
    EFilterName, TCorner, IFilterOptions,
    IConcatVideosOptions, IOverlayVideoOntoVideoOptions, IOverlayImageOntoVideoOptions
} from '../../../_shared';

const cornerOptions: TCorner[] = ['upper-left', 'upper-right', 'lower-left', 'lower-right'];

type TFilterOptionsOnChange = ({ options }: { options: IFilterOptions }) => any;

export default function FilterOptions({ name, options = {}, onChange }: {
    name: EFilterName,
    options: IFilterOptions,
    onChange: TFilterOptionsOnChange
}) {
    switch (name) {
        case EFilterName.concatVideos:
            return <ConcatVideosOptions initialOptions={options} onChange={onChange} />;
        case EFilterName.overlayImageOntoVideo:
            return <OverlayImageOntoVideoOptions initialOptions={options} onChange={onChange} />;
        case EFilterName.overlayVideoOntoVideo:
            return <OverlayVideoOntoVideoOptions initialOptions={options} onChange={onChange} />;
        default:
            return <></>;
    }
}

export function ConcatVideosOptions({ initialOptions, onChange }: {
    initialOptions: IFilterOptions,
    onChange: TFilterOptionsOnChange
}) {
    useState<IConcatVideosOptions>({
        // ...
    });

    // Currently no options available for Concat Video, but defining this now because we could add some in the future
    return (
        <div className='text-center w-full italic'>
            No Options available for Concat Videos
        </div>
    );
}

export function OverlayImageOntoVideoOptions({ initialOptions, onChange }: {
    initialOptions: IFilterOptions,
    onChange: TFilterOptionsOnChange
}) {
    const [options, setOptions] = useState<IOverlayImageOntoVideoOptions>(initialOptions);

    function handleOptionsChange(_options: IOverlayImageOntoVideoOptions) {
        setOptions(_options);
        onChange({ options: _options });
    }

    const cornerValue: TCorner = options.corner || 'upper-left';

    return (
        <>
            <Dropdown
                title='Starting Corner'
                value={cornerValue}
                items={cornerOptions}
                onChange={e => handleOptionsChange({ ...options, corner: e.target.value as TCorner })}
            />
            <StrikethroughInputWithTitle
                title='X'
                allowNumbersOnly={true}
                initialValue={String(options.x ?? '') || undefined}
                onChange={({ value }) => handleOptionsChange({ ...options, x: !Number.isNaN(Number(value)) ? Number(value) : undefined })}
            />
            <StrikethroughInputWithTitle
                title='Y'
                allowNumbersOnly={true}
                initialValue={String(options.y ?? '') || undefined}
                onChange={({ value }) => handleOptionsChange({ ...options, y: !Number.isNaN(Number(value)) ? Number(value) : undefined })}
            />
            <StrikethroughInputWithTitle
                title='Scale Ingredient Relative To Self'
                allowNumbersOnly={true}
                initialValue={String(options.scaleIngredientRelativeToSelf ?? '') || undefined}
                onChange={({ value }) => handleOptionsChange({ ...options, scaleIngredientRelativeToSelf: !Number.isNaN(Number(value)) ? Number(value) : undefined })}
            />
            <StrikethroughInputWithTitle
                title='Scale Ingredient Relative To Base'
                allowNumbersOnly={true}
                initialValue={String(options.scaleIngredientRelativeToBase ?? '') || undefined}
                onChange={({ value }) => handleOptionsChange({ ...options, scaleIngredientRelativeToBase: !Number.isNaN(Number(value)) ? Number(value) : undefined })}
            />
        </>
    )
}

export function OverlayVideoOntoVideoOptions({ initialOptions, onChange }: {
    initialOptions: IFilterOptions,
    onChange: TFilterOptionsOnChange
}) {
    const [options, setOptions] = useState<IOverlayVideoOntoVideoOptions>(initialOptions);

    function handleOptionsChange(_options: IOverlayVideoOntoVideoOptions) {
        setOptions(_options);
        onChange({ options: _options });
    }

    const cornerValue: TCorner = options.corner || 'upper-left';

    return (
        <>
            <Dropdown
                title='Starting Corner'
                value={cornerValue}
                items={cornerOptions}
                onChange={e => handleOptionsChange({ ...options, corner: e.target.value as TCorner })}
            />
            <StrikethroughInputWithTitle
                title='X'
                allowNumbersOnly={true}
                initialValue={String(options.x ?? '') || undefined}
                onChange={({ value }) => handleOptionsChange({ ...options, x: !Number.isNaN(Number(value)) ? Number(value) : undefined })}
            />
            <StrikethroughInputWithTitle
                title='Y'
                allowNumbersOnly={true}
                initialValue={String(options.y ?? '') || undefined}
                onChange={({ value }) => handleOptionsChange({ ...options, y: !Number.isNaN(Number(value)) ? Number(value) : undefined })}
            />
            <StrikethroughInputWithTitle
                title='Scale Ingredient Relative To Self'
                allowNumbersOnly={true}
                initialValue={String(options.scaleIngredientRelativeToSelf ?? '') || undefined}
                onChange={({ value }) => handleOptionsChange({ ...options, scaleIngredientRelativeToSelf: !Number.isNaN(Number(value)) ? Number(value) : undefined })}
            />
            <StrikethroughInputWithTitle
                title='Scale Ingredient Relative To Base'
                allowNumbersOnly={true}
                initialValue={String(options.scaleIngredientRelativeToBase ?? '') || undefined}
                onChange={({ value }) => handleOptionsChange({ ...options, scaleIngredientRelativeToBase: !Number.isNaN(Number(value)) ? Number(value) : undefined })}
            />
            <StrikethroughInputWithTitle
                title='Trim To'
                allowNumbersOnly={true}
                initialValue={String(options.trimTo ?? '') || undefined}
                onChange={({ value }) => handleOptionsChange({ ...options, trimTo: !Number.isNaN(Number(value)) ? Number(value) : undefined })}
            />
        </>
    )
}
