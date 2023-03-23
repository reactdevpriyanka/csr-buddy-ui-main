
import { useRouter } from "next/router";
import useSanitizedRouter from "@/hooks/useSanitizedRouter";
import { renderHook } from "@testing-library/react-hooks";
import useSWR, { useSWRConfig } from 'swr';
import useActivityFeed, { matchesFilter } from "./useActivityFeed";

jest.mock('next/router', () => ({
    useRouter: jest.fn(),
}));
jest.mock("swr");
jest.mock("@/hooks/useSanitizedRouter");

describe('matchesFilter', () => {
    it('returns true for undefined or null selectedFilter', () => {
        const activity = {
            orderAttributes: ['AUTOSHIP'],
            returnItems: [{}, {}],
            status: 'CANCELLED',
        };

        expect(matchesFilter(activity)).toBe(true);
        expect(matchesFilter(activity, null)).toBe(true);
    });

    it('returns true for "Active" selectedFilter if status is "ACTIVE"', () => {
        const activity = {
            orderAttributes: ['AUTOSHIP'],
            returnItems: [{}, {}],
            status: 'ACTIVE',
        };

        expect(matchesFilter(activity, 'Active')).toBe(true);
    });

    it('returns true for "Autoships" selectedFilter if orderAttributes includes "AUTOSHIP"', () => {
        const activity = {
            orderAttributes: ['AUTOSHIP', 'PRESCRIPTION'],
            returnItems: [{}, {}],
            status: 'CANCELLED',
        };

        expect(matchesFilter(activity, 'Autoships')).toBe(true);
    });

    it('returns true for "Returns" selectedFilter if returnItems has length greater than 0', () => {
        const activity = {
            orderAttributes: ['AUTOSHIP'],
            returnItems: [{}, {}],
            status: 'CANCELLED',
        };

        expect(matchesFilter(activity, 'Returns')).toBe(true);
    });

    it('returns true for "Cancellations" or "Cancelled" selectedFilter if status is "CANCELLED"', () => {
        const activity1 = {
            orderAttributes: ['AUTOSHIP'],
            returnItems: [{}, {}],
            status: 'CANCELLED',
        };
        const activity2 = {
            orderAttributes: ['AUTOSHIP'],
            returnItems: [{}, {}],
            status: 'CANCELED',
        };

        expect(matchesFilter(activity1, 'Cancellations')).toBe(true);
        expect(matchesFilter(activity2, 'Cancelled')).toBe(true);
    });

    it('returns true for "Prescription Items" selectedFilter if orderAttributes includes "PRESCRIPTION"', () => {
        const activity = {
            orderAttributes: ['AUTOSHIP', 'PRESCRIPTION'],
            returnItems: [{}, {}],
            status: 'CANCELLED',
        };

        expect(matchesFilter(activity, 'Prescription Items')).toBe(true);
    });
});

describe("useActivityFeed", () => {
   

    beforeEach(() => {
        useRouter.mockReturnValue({
            pathname: '/',
        });
        useSWRConfig.mockReturnValue({
            cache: {
                get: () => {
                    return {
                        customerId: "162318096"
                    }
                }
            }
        });
        useSanitizedRouter.mockReturnValue({
            id: "162318096",
            byAttribute: "Returns",
        });
    });

    test("should return an empty array when data is null", () => {
        useSWR.mockReturnValueOnce({ data: [] });
        const { result } = renderHook(() => useActivityFeed());
        expect(result.current.data).toHaveLength(0);
        expect(result.current.data).toEqual([]);
        expect(result.current.getAll()).toEqual([]);
    });

    describe("when data is not empty", () => {

        test("filters data by activity category on autoship page", () => {
            useRouter.mockReturnValue({
                pathname: "/autoship",
                query: {
                    byAutoshipAttribute: 'All',
                },
            });
            useSWR.mockReturnValue({
                data: [{ "activityTimestamp": "2022-06-15T18:54:12.361Z", "activityType": "SUBSCRIPTION_CHANGED", "activitySource": "AUTOSHIP", "activityId": "851114645", "activityCategory": "AUTOSHIP", "customerId": "162318096", "sourceEventId": "2LLusFnVFIQfZs3KvsAZBTj2d28" }, { "activityTimestamp": "2022-01-07T22:39:43.100Z", "activityType": "AUTOSHIP_UPCOMING_FULFILLMENT", "activitySource": "AUTOSHIP", "activityId": "800055095", "activityCategory": "AUTOSHIP", "customerId": "162318096", "sourceEventId": "2LuPegvg0We4cBi8aR5RVjvRmqx" }],
            });
            const { result } = renderHook(() => useActivityFeed());
            expect(result.current.data).toHaveLength(2);
            expect(matchesFilter(result.current.data, 'All')).toBe(true);
        });

        test("filters data by attribute querystring parameter on activity page", () => {
            useSWR.mockReturnValue({
                data: [{ "activityTimestamp": "2022-06-15T18:54:12.361Z", "activityType": "SUBSCRIPTION_CHANGED", "activitySource": "AUTOSHIP", "activityId": "851114645", "activityCategory": "AUTOSHIP", "customerId": "162318096", "sourceEventId": "2LLusFnVFIQfZs3KvsAZBTj2d28" }, { "activityTimestamp": "2022-01-07T22:39:43.100Z", "activityType": "AUTOSHIP_UPCOMING_FULFILLMENT", "activitySource": "AUTOSHIP", "activityId": "800055095", "activityCategory": "AUTOSHIP", "customerId": "162318096", "sourceEventId": "2LuPegvg0We4cBi8aR5RVjvRmqx" }],
            });
            const { result } = renderHook(() => useActivityFeed());
            expect(result.current.data).toHaveLength(2);
            expect(matchesFilter(result.current.data, 'All')).toBe(true);
        })
    })
});