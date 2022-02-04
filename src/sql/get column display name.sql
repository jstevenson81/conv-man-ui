with cols_attr as (
  select
    COLUMN_NAME as cnv_data_column
  from
    sys.all_tab_columns
  where
    1 = 1
    and table_name = 'CNV_DATA'
),
cols_data as (
  select
    distinct cnv_attribute,
    display_name,
    obj_key
  from
    CNV_HDL_ATTRIBUTES
  where
    1 = 1
)
select
  ca.cnv_data_column,
  cd.display_name,
  obj_key
from
  cols_attr ca,
  cols_data cd
where
  ca.cnv_data_column = cd.cnv_attribute