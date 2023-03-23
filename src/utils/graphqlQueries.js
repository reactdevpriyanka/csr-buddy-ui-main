export const advancedOrderSearchQuery = (paramStr, sort, page, size, orderId) =>
  !orderId
    ? `
      query getOrders {
        searchOrders(criteria: {${paramStr}},
        sort: {sortField: TIME_PLACED, sortDirection: ${sort}},
        page: { page: ${page ?? 0},
        pageLimit: ${size} }) {
          totalResults
          currentPage
          numberOfPages
          results {
            externalOrderId
            memberId
            status
            timePlaced
            timeUpdated
            total {
              value
              currency
            }
            blocked
            blocks {
              comments
              id
              legacyId
              reason
              resolved
              timeBlocked
            }
            comments
            editorId
            submitter
            submitterId
            businessChannel
            orgId
            siteId
            donationOrgId
            timePlaced
            timeUpdated
          }
        }
      }
    `
    : `
      query getOrder {
        byOrderId(externalOrderId: "${orderId}") {
          externalOrderId
          memberId
          status
          timePlaced
          timeUpdated
          total {
            value
            currency
          }
          blocked
          blocks {
            comments
            id
            legacyId
            reason
            resolved
            timeBlocked
          }
          comments
          editorId
          submitter
          submitterId
          businessChannel
          orgId
          siteId
          donationOrgId
          timePlaced
          timeUpdated
        }
      }
    `;
