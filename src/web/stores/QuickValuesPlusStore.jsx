const Reflux = require('reflux');

const fetch = require('logic/rest/FetchProvider').default;

const UserNotification = require('util/UserNotification');
const ApiRoutes = require('routing/ApiRoutes');
const URLUtils = require('util/URLUtils');
const StoreProvider = require('injection/StoreProvider');
const SearchStore = StoreProvider.getStore('Search');

export const QuickValuesPlusActions = Reflux.createActions({
    'getQuickValues': {asyncResult: true},
});

export const QuickValuesPlusStore = Reflux.createStore({
    listenables: [QuickValuesPlusActions],
    getInitialState() {
    },
    getQuickValues(field, tableSize, sortOrder) {
        const originalSearchURLParams = SearchStore.getOriginalSearchURLParams();
        const streamId = SearchStore.searchInStream ? SearchStore.searchInStream.id : null;
        const rangeType = originalSearchURLParams.get('rangetype');
        let sort_order = (sortOrder === "descending") ? 'desc' : 'asc';
        let timerange = {};
        switch (rangeType) {
            case 'relative':
                timerange['range'] = originalSearchURLParams.get('relative');
                break;
            case 'absolute':
                timerange['from'] = originalSearchURLParams.get('from');
                timerange['to'] = originalSearchURLParams.get('to');
                break;
            case 'keyword':
                timerange['keyword'] = originalSearchURLParams.get('keyword');
                break;
        }
        let url = ApiRoutes.UniversalSearchApiController.fieldTerms(rangeType, originalSearchURLParams.get('q') || '*', field, timerange, streamId).url;
        url = URLUtils.qualifyUrl(url);

        // If it was set, append the optional Size parameter to the query.
        if (tableSize !== undefined) url = url + "&size=" + tableSize;

        // Append the sort order if we are using Relative time.
        if (rangeType === "relative") url = url + "&order=" + field + ":" + sort_order;

        const promise = fetch('GET', url);
        promise.catch(function (error) {
            UserNotification.error('Loading quick values failed with status: ' + error, 'Could not load quick values');
        });

        QuickValuesPlusActions.getQuickValues.promise(promise);
    },
});