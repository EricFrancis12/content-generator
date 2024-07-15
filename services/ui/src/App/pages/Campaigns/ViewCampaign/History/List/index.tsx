import React, { useState } from 'react';
import Pagination, { handlePaginationClick } from '../../../../../components/Pagination';
import { generatePagination } from '../../../../../utils';
import { IHistoryItem } from '../../../../../../_shared';
import NoHistory from '../NoHistory';
import SearchQuery from './SearchQuery';
import ItemsPerPage from './ItemsPerPage';
import HistoryItems from './HistoryItems';

export default function List({ history }: {
    history: IHistoryItem[]
}) {
    const [searchQuery, setSearchQuery] = useState('');
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(history.length / itemsPerPage);
    const pagination = generatePagination({ currentPage, totalPages });

    function filterHistory() {
        const resultsThatIncludeSearchQuery = history.filter(historyItem => !searchQuery ? true : historyItem.externalId.toLowerCase().includes(searchQuery.toLowerCase()));
        const resultsOnCurrentPage = resultsThatIncludeSearchQuery.filter((_, index) => index > (itemsPerPage * (currentPage - 1) - 1) && index <= (itemsPerPage * (currentPage) - 1));
        return resultsOnCurrentPage;
    }
    const filteredHistory = filterHistory();

    function handleItemsPerPageChange(e: React.ChangeEvent<HTMLSelectElement>) {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1);
    }



    return (
        <div className='w-full p-2'>
            <div className='flex flex-col sm:flex-row justify-between items-center gap-2 w-full mt-2 mb-4'>
                <SearchQuery
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                />
                <ItemsPerPage
                    value={itemsPerPage}
                    onChange={handleItemsPerPageChange}
                />
            </div>
            {history.length <= 0
                ? <NoHistory />
                : <>
                    <HistoryItems history={filteredHistory} />
                    <Pagination
                        pagination={pagination}
                        currentPage={currentPage}
                        onClick={pagination => handlePaginationClick({
                            pagination,
                            totalPages,
                            currentPage,
                            setCurrentPage,
                        })}
                    />
                </>
            }
        </div>
    )
}
