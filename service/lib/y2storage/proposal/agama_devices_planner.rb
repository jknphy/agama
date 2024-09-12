# frozen_string_literal: true

# Copyright (c) [2024] SUSE LLC
#
# All Rights Reserved.
#
# This program is free software; you can redistribute it and/or modify it
# under the terms of version 2 of the GNU General Public License as published
# by the Free Software Foundation.
#
# This program is distributed in the hope that it will be useful, but WITHOUT
# ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
# FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for
# more details.
#
# You should have received a copy of the GNU General Public License along
# with this program; if not, contact SUSE LLC.
#
# To contact SUSE LLC about this file by physical or electronic mail, you may
# find current contact information at www.suse.com.

require "y2storage/proposal/agama_drive_planner"
require "y2storage/planned"

module Y2Storage
  module Proposal
    # Devices planner for Agama.
    class AgamaDevicesPlanner
      include Yast::Logger

      # @param devicegraph [Devicegraph]
      # @param issues_list [Array<Agama::Issue>]
      def initialize(devicegraph, issues_list)
        @devicegraph = devicegraph
        @issues_list = issues_list
      end

      # List of devices that need to be created to satisfy the settings. Does not include
      # devices needed for booting.
      #
      # For the time being, this implements only stuff coming from partitition elements within
      # drive elements.
      #
      # @param config [Agama::Storage::Config]
      # @return [Planned::DevicesCollection]
      def planned_devices(config)
        # In the future this will also include planned devices that are equivalent to
        # those typically generated by the Guided Proposal. For those, note that:
        #  - For dedicated VGs it creates a Planned VG containing a Planned LV, but no PVs
        #  - For LVM volumes it create a Planned LV but associated to no planned VG
        #  - For partition volumes, it creates a planned partition, of course
        planned = planned_for_drives(config)
        Planned::DevicesCollection.new(planned)
      end

    protected

      # @return [Y2Storage::Devicegraph]
      attr_reader :devicegraph

      # @return [Array<Agama::Issue>] List to register any found issue
      attr_reader :issues_list

      # @param config [Agama::Storage::Config]
      # @return [Array<Planned::Device>]
      def planned_for_drives(config)
        config.drives.flat_map do |drive|
          planner = AgamaDrivePlanner.new(devicegraph, issues_list)
          planner.planned_devices(drive)
        end
      end
    end
  end
end
