/*
 * Copyright (c) [2022-2023] SUSE LLC
 *
 * All Rights Reserved.
 *
 * This program is free software; you can redistribute it and/or modify it
 * under the terms of version 2 of the GNU General Public License as published
 * by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for
 * more details.
 *
 * You should have received a copy of the GNU General Public License along
 * with this program; if not, contact SUSE LLC.
 *
 * To contact SUSE LLC about this file by physical or electronic mail, you may
 * find current contact information at www.suse.com.
 */

import React, { useReducer, useEffect } from "react";
import { useCancellablePromise } from "~/utils";
import { useInstallerClient } from "~/context/installer";
import { BUSY } from "~/client/status";
import { ProgressText, Section } from "~/components/core";
import { ProposalSummary } from "~/components/storage";

const initialState = {
  busy: true,
  proposal: undefined,
  errors: [],
  progress: { message: "Probing storage devices", current: 0, total: 0 }
};

const reducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_PROGRESS": {
      const { message, current, total } = action.payload;
      return { ...state, progress: { message, current, total } };
    }

    case "UPDATE_STATUS": {
      return { ...initialState, busy: action.payload.status === BUSY };
    }

    case "UPDATE_PROPOSAL": {
      if (state.busy) return state;

      const { proposal, errors } = action.payload;

      return { ...state, proposal, errors };
    }

    default: {
      return state;
    }
  }
};

export default function StorageSection({ showErrors }) {
  const { storage: client } = useInstallerClient();
  const { cancellablePromise } = useCancellablePromise();
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const updateStatus = (status) => {
      dispatch({ type: "UPDATE_STATUS", payload: { status } });
    };

    cancellablePromise(client.getStatus()).then(updateStatus);

    return client.onStatusChange(updateStatus);
  }, [client, cancellablePromise]);

  useEffect(() => {
    const updateProposal = async () => {
      const isDeprecated = await cancellablePromise(client.isDeprecated());
      if (isDeprecated) await cancellablePromise(client.probe());

      const proposal = await cancellablePromise(client.proposal.getData());
      const errors = await cancellablePromise(client.getValidationErrors());

      dispatch({ type: "UPDATE_PROPOSAL", payload: { proposal, errors } });
    };

    if (!state.busy) updateProposal();
  }, [client, cancellablePromise, state.busy]);

  useEffect(() => {
    cancellablePromise(client.getProgress()).then(({ message, current, total }) => {
      dispatch({
        type: "UPDATE_PROGRESS",
        payload: { message, current, total }
      });
    });
  }, [client, cancellablePromise]);

  useEffect(() => {
    return client.onProgressChange(({ message, current, total }) => {
      dispatch({
        type: "UPDATE_PROGRESS",
        payload: { message, current, total }
      });
    });
  }, [client, cancellablePromise]);

  useEffect(() => {
    return client.onDeprecate(() => client.probe());
  }, [client]);

  const errors = showErrors ? state.errors : [];

  const busy = state.busy || !state.proposal;

  const SectionContent = () => {
    if (busy) {
      const { message, current, total } = state.progress;
      return (
        <ProgressText message={message} current={current} total={total} />
      );
    }

    return (
      <ProposalSummary proposal={state.proposal} />
    );
  };

  return (
    <Section
      key="storage-section"
      title="Storage"
      path="/storage"
      icon="hard_drive"
      loading={busy}
      errors={errors}
    >
      <SectionContent />
    </Section>
  );
}
