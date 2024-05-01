import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import _shared, {
    ESourceType, EContentType, EFilterName, EFilterComponentType, EOutputType, ICampaign,
    IFilterOptions, IConcatVideosOptions, IOverlayVideoOntoVideoOptions, IOverlayImageOntoVideoOptions
} from '../../_shared';
const { boilerplateFilter, boilerplateOutput } = _shared.utils;

export default function CampaignEditor({ campaign, setCampaign }: {
    campaign: ICampaign | null,
    setCampaign: React.Dispatch<React.SetStateAction<ICampaign | null>>
}) {
    const trueOrFalseStrings = ['FALSE', 'TRUE'];
    const sourceTypes: ESourceType[] = Object.values(ESourceType).filter(value => value !== ESourceType.CREATED_BY_FILTER);
    const contentTypes: EContentType[] = Object.values(EContentType).filter(value => value !== EContentType.UNKNOWN);
    const filterNames: EFilterName[] = Object.values(EFilterName);
    const filterComponentTypes: EFilterComponentType[] = Object.values(EFilterComponentType);
    const outputTypes: EOutputType[] = Object.values(EOutputType);

    return (
        <>
            {campaign
                ? <div className='flex flex-col items-center gap-4 min-h-[200px] w-full p-4 border'>
                    <ComponentGroup>
                        <Input
                            title='Campaign Name:'
                            value={campaign.name}
                            onChange={e => setCampaign({ ...campaign, name: e.target.value })}
                        />
                        <Dropdown
                            title='Source Type:'
                            value={campaign.source.type}
                            items={sourceTypes}
                            onChange={e => setCampaign({ ...campaign, source: { ...campaign.source, type: e.target.value as ESourceType } })}
                        />
                        <Dropdown
                            title='Content Type:'
                            value={campaign.source.contentType}
                            items={contentTypes}
                            onChange={e => setCampaign({ ...campaign, source: { ...campaign.source, contentType: e.target.value as EContentType } })}
                        />
                        <Input
                            title='External ID:'
                            value={campaign.source.externalId}
                            onChange={e => setCampaign({ ...campaign, source: { ...campaign.source, externalId: e.target.value } })}
                        />
                    </ComponentGroup>
                    {campaign.source.contentType === EContentType.VIDEO &&
                        <ComponentGroup>
                            <Input
                                title='Min Video Length (in seconds):'
                                value={String(campaign.options?.minVideoLength || '')}
                                onChange={e => setCampaign({ ...campaign, options: { ...campaign.options, minVideoLength: Number(e.target.value) || undefined } })}
                            />
                            <Input
                                title='Max Video Length (in seconds):'
                                value={String(campaign.options?.maxVideoLength || '')}
                                onChange={e => setCampaign({ ...campaign, options: { ...campaign.options, maxVideoLength: Number(e.target.value) || undefined } })}
                            />
                            <Dropdown
                                title='Accept Short Videos Only:'
                                value={String(campaign.options?.shortVideosOnly || false).toUpperCase()}
                                items={trueOrFalseStrings}
                                onChange={e => setCampaign({ ...campaign, options: { ...campaign.options, shortVideosOnly: e.target.value.toLowerCase() === 'true' ? true : false } })}
                            />
                            <Dropdown
                                title='Accept Long Videos Only:'
                                value={String(campaign.options?.longVideosOnly || false).toUpperCase()}
                                items={trueOrFalseStrings}
                                onChange={e => setCampaign({ ...campaign, options: { ...campaign.options, longVideosOnly: e.target.value.toLowerCase() === 'true' ? true : false } })}
                            />
                        </ComponentGroup>
                    }
                    <ComponentGroup>
                        <ComponentTitle title='Filters:' />
                        {campaign.filters.map((filter, index) => (
                            <div key={index} className='flex flex-col gap-4 px-2 py-4 border rounded-lg'>
                                <div className='flex justify-end items-center w-full'>
                                    <FontAwesomeIcon
                                        icon={faTrashAlt}
                                        className='px-2 cursor-pointer hover:text-red-400'
                                        style={{
                                            transition: 'color 0.15s ease'
                                        }}
                                        onClick={() => setCampaign({ ...campaign, filters: campaign.filters.filter((_, _index) => _index !== index) })}
                                    />
                                </div>
                                <Dropdown
                                    title='Filter Name:'
                                    value={filter.name}
                                    items={filterNames}
                                    onChange={e => setCampaign({ ...campaign, filters: campaign.filters.map((_filter, _index) => _index === index ? { ..._filter, name: e.target.value as EFilterName } : _filter) })}
                                />
                                <FilterOptions
                                    name={filter.name}
                                    onChange={({ options }) => setCampaign({ ...campaign, filters: campaign.filters.map((_filter, _index) => _index === index ? { ..._filter, options } : _filter) })}
                                />
                                <FilterComponentWrapper title='Base'>
                                    <Dropdown
                                        title='Filter Type:'
                                        value={filter.base.type}
                                        items={filterComponentTypes}
                                        onChange={e => setCampaign({ ...campaign, filters: campaign.filters.map((_filter, _index) => _index === index ? { ..._filter, base: { ..._filter.base, type: e.target.value as EFilterComponentType } } : _filter) })}
                                    />
                                    <Dropdown
                                        title='Content Type:'
                                        value={filter.base.contentType}
                                        items={contentTypes}
                                        onChange={e => setCampaign({ ...campaign, filters: campaign.filters.map((_filter, _index) => _index === index ? { ..._filter, base: { ..._filter.base, contentType: e.target.value as EContentType } } : _filter) })}
                                    />
                                    <Input
                                        title='Internal ID:'
                                        value={filter.base.internalId}
                                        onChange={e => setCampaign({ ...campaign, filters: campaign.filters.map((_filter, _index) => _index === index ? { ..._filter, base: { ..._filter.base, internalId: e.target.value } } : _filter) })}
                                    />
                                    <Input
                                        title='Filter Index:'
                                        value={String(filter.base.filterIndex)}
                                        onChange={e => setCampaign({ ...campaign, filters: campaign.filters.map((_filter, _index) => _index === index ? { ..._filter, base: { ..._filter.base, filterIndex: Number(e.target.value) || 0 } } : _filter) })}
                                    />
                                </FilterComponentWrapper>
                                <FilterComponentWrapper title='Ingredient'>
                                    <Dropdown
                                        title='Filter Type:'
                                        value={filter.ingredient.type}
                                        items={filterComponentTypes}
                                        onChange={e => setCampaign({ ...campaign, filters: campaign.filters.map((_filter, _index) => _index === index ? { ..._filter, ingredient: { ..._filter.ingredient, type: e.target.value as EFilterComponentType } } : _filter) })}
                                    />
                                    <Dropdown
                                        title='Content Type:'
                                        value={filter.ingredient.contentType}
                                        items={contentTypes}
                                        onChange={e => setCampaign({ ...campaign, filters: campaign.filters.map((_filter, _index) => _index === index ? { ..._filter, ingredient: { ..._filter.ingredient, contentType: e.target.value as EContentType } } : _filter) })}
                                    />
                                    <Input
                                        title='Internal ID:'
                                        value={filter.ingredient.internalId}
                                        onChange={e => setCampaign({ ...campaign, filters: campaign.filters.map((_filter, _index) => _index === index ? { ..._filter, ingredient: { ..._filter.ingredient, internalId: e.target.value } } : _filter) })}
                                    />
                                    <Input
                                        title='Filter Index:'
                                        value={String(filter.ingredient.filterIndex)}
                                        onChange={e => setCampaign({ ...campaign, filters: campaign.filters.map((_filter, _index) => _index === index ? { ..._filter, ingredient: { ..._filter.ingredient, filterIndex: Number(e.target.value) || 0 } } : _filter) })}
                                    />
                                </FilterComponentWrapper>
                            </div>
                        ))}
                        <AddButton
                            text='Add Filter'
                            onClick={() => setCampaign({ ...campaign, filters: [...campaign.filters, boilerplateFilter()] })}
                        />
                    </ComponentGroup>
                    <ComponentGroup>
                        <ComponentTitle title='Publish To:' />
                        {campaign.publishTo.map(output => (
                            <div key={output._id} className='flex flex-col gap-4 px-2 py-4 border rounded-lg'>
                                <div className='flex justify-end items-center w-full'>
                                    <FontAwesomeIcon
                                        icon={faTrashAlt}
                                        className='px-2 cursor-pointer hover:text-red-400'
                                        style={{
                                            transition: 'color 0.15s ease'
                                        }}
                                        onClick={() => setCampaign({ ...campaign, publishTo: campaign.publishTo.filter(_output => _output._id !== output._id) })}
                                    />
                                </div>
                                <Dropdown
                                    title='Output Type:'
                                    value={output.outputType}
                                    items={outputTypes}
                                    onChange={e => setCampaign({ ...campaign, publishTo: campaign.publishTo.map(_output => _output._id === output._id ? { ..._output, outputType: e.target.value as EOutputType } : _output) })}
                                />
                                <Dropdown
                                    title='Content Type:'
                                    value={output.contentType}
                                    items={contentTypes}
                                    onChange={e => setCampaign({ ...campaign, publishTo: campaign.publishTo.map(_output => _output._id === output._id ? { ..._output, contentType: e.target.value as EContentType } : _output) })}
                                />
                                <Input
                                    title='External ID:'
                                    value={output.externalId}
                                    onChange={e => setCampaign({ ...campaign, publishTo: campaign.publishTo.map(_output => _output._id === output._id ? { ..._output, externalId: e.target.value } : _output) })}
                                />
                                <Dropdown
                                    title='Disabled:'
                                    value={String(output.disabled || false).toUpperCase()}
                                    items={trueOrFalseStrings}
                                    onChange={e => setCampaign({ ...campaign, publishTo: campaign.publishTo.map(_output => _output._id === output._id ? { ..._output, disabled: e.target.value.toLowerCase() === 'true' ? true : false } : _output) })}
                                />
                                {(output.outputType === EOutputType.SEND_CONTENT_TO_TELEGRAM_CHANNEL ||
                                    output.outputType === EOutputType.SEND_MESSAGE_TO_TELEGRAM_CHANNEL) &&
                                    <Input
                                        title='Message:'
                                        value={output.options?.message || ''}
                                        onChange={e => setCampaign({ ...campaign, publishTo: campaign.publishTo.map(_output => _output._id === output._id ? { ..._output, options: { ..._output.options, message: e.target.value } } : _output) })}
                                    />
                                }
                            </div>
                        ))}
                        <AddButton
                            text='Add Publisher'
                            onClick={() => setCampaign({ ...campaign, publishTo: [...campaign.publishTo, boilerplateOutput()] })}
                        />
                    </ComponentGroup>
                </div>
                : ''
            }
        </>
    )
}

function ComponentGroup({ children }: {
    children?: React.ReactNode
}) {
    return (
        <div className='flex flex-col gap-4 w-full md:w-[unset] md:min-w-[600px] px-2 py-4 bg-slate-800 rounded-lg'>
            {children}
        </div>
    )
}

function ComponentWrapper({ children }: {
    children?: React.ReactNode
}) {
    return (
        <div className='flex flex-col sm:flex-row justify-between items-center gap-4 w-full px-1'>
            {children}
        </div>
    )
}

function ComponentTitle({ title }: {
    title: string
}) {
    return (
        <div className='w-full px-1'>
            <span className='px-1'>{title}</span>
        </div>
    )
}

type TFilterOptionsOnChange = ({ options }: { options: IFilterOptions }) => any;

function FilterOptions({ name, onChange }: {
    name: EFilterName,
    onChange: TFilterOptionsOnChange
}) {
    switch (name) {
        case EFilterName.concatVideos:
            return <ConcatVideosOptions onChange={onChange} />;
        case EFilterName.overlayImageOntoVideo:
            return <OverlayImageOntoVideoOptions onChange={onChange} />;
        case EFilterName.overlayVideoOntoVideo:
            return <OverlayVideoOntoVideoOptions onChange={onChange} />;
        default:
            return <></>;
    }
}

function ConcatVideosOptions({ onChange }: {
    onChange: TFilterOptionsOnChange
}) {
    useState<IConcatVideosOptions>({
        // ...
    });

    return <></>; // Currently no options available for Concat Video, but defining this now because we could add some in the future
}

function OverlayImageOntoVideoOptions({ onChange }: {
    onChange: TFilterOptionsOnChange
}) {
    const [options] = useState<IOverlayImageOntoVideoOptions>({
        // ...
    });

    return (
        <>
            Overlay Image Onto Video Options: {JSON.stringify(options)}
        </>
    )
}

function OverlayVideoOntoVideoOptions({ onChange }: {
    onChange: TFilterOptionsOnChange
}) {
    const [options] = useState<IOverlayVideoOntoVideoOptions>({
        // ...
    });

    return (
        <>
            Overlay Video Onto Video Options: {JSON.stringify(options)}
        </>
    )
}

function FilterComponentWrapper({ title, children }: {
    title: string,
    children?: React.ReactNode
}) {
    return (
        <div className='flex flex-col sm:flex-row justify-between gap-4 w-full px-2 py-4 border rounded-lg'>
            <span className='px-1'>{title}</span>
            <div className='flex flex-col gap-4 px-2 py-4'>
                {children}
            </div>
        </div>
    )
}

function Input({ title, value, onChange }: {
    title: string,
    value: string,
    onChange: React.ChangeEventHandler<HTMLInputElement>
}) {
    return (
        <ComponentWrapper>
            <span>{title}</span>
            <input
                className='text-center w-full sm:w-[50%] px-4 py-1 rounded-full'
                value={value}
                onChange={onChange}
            />
        </ComponentWrapper>
    )
}

function Dropdown({ title, value, items, onChange }: {
    title: string,
    value: string,
    items: string[],
    onChange: React.ChangeEventHandler<HTMLSelectElement>
}) {
    return (
        <ComponentWrapper>
            <span>{title}</span>
            <select
                className='text-center w-full sm:w-[50%] px-4 py-1 rounded-full'
                value={value}
                onChange={onChange}
            >
                {items.map((item, index) => (
                    <option key={index} value={item}>{item}</option>
                ))}
            </select>
        </ComponentWrapper>
    )
}

function AddButton({ text, onClick }: {
    text: string,
    onClick: React.MouseEventHandler<HTMLButtonElement>
}) {
    return (
        <button
            className='flex gap-2 justify-center items-center p-2 border rounded-lg'
            onClick={onClick}
        >
            <FontAwesomeIcon icon={faPlus} />
            <span>{text}</span>
        </button>
    )
}
