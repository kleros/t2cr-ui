import { graphql } from "relay-hooks";
import { useQuery } from "../../../components";


export default function TokenWithID() {
  const { props } = useQuery();
  console.info(props)
  return 'Hello'
}

export const IdQuery = graphql`
  query IdQuery($id: ID!) {
    token(id: $id) {
      id
      status
      name
      ticker
      address
      symbolMultihash
      disputed
      appealPeriodStart
      appealPeriodEnd
      requests {
        submissionTime
        result
        resolutionTime
        requester
        challenger
        rounds {
          amountPaidRequester
          amountPaidChallenger
          hasPaidRequester
          hasPaidChallenger
          appealTime
          ruling
          rulingTime
          appealPeriodStart
          appealPeriodEnd
        }
        evidences {
          submitter
          submissionTime
          evidenceURI
        }
      }
    }
  }
`;
