/*
 * Copyright 2021 Cortex Applications, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import React from "react";
import { useApi, useRouteRefParams } from "@backstage/core-plugin-api";
import { scorecardRouteRef } from "../../../routes";
import { cortexApiRef } from "../../../api";
import { useAsync } from "react-use";
import { Progress, WarningPanel } from "@backstage/core-components";
import { ScorecardDetails } from "./ScorecardDetails";

export const ScorecardDetailsPage = () =>  {

  const { id: scorecardId } = useRouteRefParams(scorecardRouteRef)

  const cortexApi = useApi(cortexApiRef);

  const { value, loading, error } = useAsync(async () => {
    const [ scorecard, scores ] = await Promise.all([
      cortexApi.getScorecard(scorecardId),
      cortexApi.getScorecardScores(scorecardId)
    ])

    return { scorecard, scores }
  }, []);

  if (loading) {
    return <Progress />;
  }

  const { scorecard, scores } = value ?? { scorecard: undefined, scores: undefined }

  if (error || scorecard === undefined || scores === undefined) {
    return (
      <WarningPanel severity="error" title="Could not load scorecard.">
        {error?.message ?? ''}
      </WarningPanel>
    );
  }


  return (
    <ScorecardDetails
      scorecard={scorecard}
      scores={scores}
    />
  )
}
