select
  pu.username,
  papf.person_number,
  ppnf.full_name,
  prd.active_flag,
  prd.job_role,
  prd.data_role,
  prd.ABSTRACT_ROLE,
  prd.role_common_name,
  prd.ROLE_DISTINGUISHED_NAME,
  prdt.role_name,
  prd.external_role,
  prd.duty_role
from
  PER_ROLES_DN prd,
  per_roles_dn_tl prdt,
  per_user_roles pur,
  per_users pu,
  per_all_people_f papf,
  per_person_names_f ppnf
where
  1 = 1
  and pu.user_guid = fnd_global.user_guid
  and prd.role_id = pur.role_id
  and prd.role_id = prdt.role_id
  and pur.user_id = pu.user_id
  and pu.person_id = papf.person_id(+)
  and papf.person_id = ppnf.person_id(+)
  and ppnf.name_type(+) = 'GLOBAL'
  and sysdate between ppnf.effective_start_date(+)
  and ppnf.effective_end_date(+)
  and sysdate between papf.effective_start_date(+)
  and papf.effective_end_date(+)