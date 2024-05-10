use utoipa::OpenApi;
#[derive(OpenApi)]
#[openapi(
    info(description = "Agama web API description"),
    paths(
        crate::l10n::web::get_config,
        crate::l10n::web::keymaps,
        crate::l10n::web::locales,
        crate::l10n::web::set_config,
        crate::l10n::web::timezones,
        crate::network::web::add_connection,
        crate::network::web::apply,
        crate::network::web::connect,
        crate::network::web::connections,
        crate::network::web::delete_connection,
        crate::network::web::devices,
        crate::network::web::disconnect,
        crate::network::web::update_connection,
        crate::software::web::get_config,
        crate::software::web::patterns,
        crate::software::web::set_config,
        crate::software::web::proposal,
        crate::software::web::probe,
        crate::software::web::products,
        crate::manager::web::probe_action,
        crate::manager::web::install_action,
        crate::manager::web::finish_action,
        crate::manager::web::installer_status,
        crate::questions::web::list_questions,
        crate::questions::web::answer,
        crate::users::web::get_root_config,
        crate::users::web::get_user_config,
        crate::users::web::set_first_user,
        crate::users::web::remove_first_user,
        crate::users::web::patch_root,
        super::http::ping,
        crate::storage::web::iscsi::initiator,
        crate::storage::web::iscsi::update_initiator,
        crate::storage::web::iscsi::nodes,
        crate::storage::web::iscsi::update_node,
        crate::storage::web::iscsi::delete_node,
        crate::storage::web::iscsi::login_node,
        crate::storage::web::iscsi::logout_node,
        crate::storage::web::iscsi::discover
    ),
    components(
        schemas(agama_lib::product::Product),
        schemas(agama_lib::software::Pattern),
        schemas(agama_lib::manager::InstallationPhase),
        schemas(crate::l10n::Keymap),
        schemas(crate::l10n::LocaleEntry),
        schemas(crate::l10n::TimezoneEntry),
        schemas(crate::l10n::web::LocaleConfig),
        schemas(crate::network::model::Device),
        schemas(crate::network::model::Connection),
        schemas(agama_lib::network::types::DeviceType),
        schemas(crate::software::web::SoftwareConfig),
        schemas(crate::software::web::SoftwareProposal),
        schemas(crate::manager::web::InstallerStatus),
        schemas(crate::questions::web::Question),
        schemas(crate::questions::web::GenericQuestion),
        schemas(crate::questions::web::QuestionWithPassword),
        schemas(crate::questions::web::Answer),
        schemas(crate::questions::web::GenericAnswer),
        schemas(crate::questions::web::PasswordAnswer),
        schemas(agama_lib::users::FirstUser),
        schemas(crate::users::web::RootConfig),
        schemas(crate::users::web::RootPatchSettings),
        schemas(super::http::PingResponse),
        schemas(crate::storage::web::iscsi::InitiatorParams),
        schemas(crate::storage::web::iscsi::DiscoverParams),
        schemas(crate::storage::web::iscsi::NodeParams),
        schemas(crate::storage::web::iscsi::LoginParams),
        schemas(agama_lib::storage::client::iscsi::ISCSIInitiator),
        schemas(agama_lib::storage::client::iscsi::ISCSINode),
        schemas(agama_lib::storage::client::iscsi::ISCSIAuth),
        schemas(agama_lib::storage::client::iscsi::LoginResult),
        schemas(agama_lib::network::settings::NetworkConnection)
    )
)]
pub struct ApiDoc;
