/**
 * 中国邮票数据索引
 * 按年拆分，每年一个文件（src/data/{年份}.js）
 * 自动生成，请勿手动编辑。
 */

import data_1949 from "./1949.js";
import data_1950 from "./1950.js";
import data_1951 from "./1951.js";
import data_1952 from "./1952.js";
import data_1953 from "./1953.js";
import data_1954 from "./1954.js";
import data_1955 from "./1955.js";
import data_1956 from "./1956.js";
import data_1957 from "./1957.js";
import data_1958 from "./1958.js";
import data_1959 from "./1959.js";
import data_1960 from "./1960.js";
import data_1961 from "./1961.js";
import data_1962 from "./1962.js";
import data_1963 from "./1963.js";
import data_1964 from "./1964.js";
import data_1965 from "./1965.js";
import data_1966 from "./1966.js";
import data_1967 from "./1967.js";
import data_1968 from "./1968.js";
import data_1969 from "./1969.js";
import data_1970 from "./1970.js";
import data_1971 from "./1971.js";
import data_1972 from "./1972.js";
import data_1973 from "./1973.js";
import data_1974 from "./1974.js";
import data_1975 from "./1975.js";
import data_1976 from "./1976.js";
import data_1977 from "./1977.js";
import data_1978 from "./1978.js";
import data_1979 from "./1979.js";
import data_1980 from "./1980.js";
import data_1981 from "./1981.js";
import data_1982 from "./1982.js";
import data_1983 from "./1983.js";
import data_1984 from "./1984.js";
import data_1985 from "./1985.js";
import data_1986 from "./1986.js";
import data_1987 from "./1987.js";
import data_1988 from "./1988.js";
import data_1989 from "./1989.js";
import data_1990 from "./1990.js";
import data_1991 from "./1991.js";
import data_1992 from "./1992.js";
import data_1993 from "./1993.js";
import data_1994 from "./1994.js";
import data_1995 from "./1995.js";
import data_1996 from "./1996.js";
import data_1997 from "./1997.js";
import data_1998 from "./1998.js";
import data_1999 from "./1999.js";
import data_2000 from "./2000.js";
import data_2001 from "./2001.js";
import data_2002 from "./2002.js";
import data_2003 from "./2003.js";
import data_2004 from "./2004.js";
import data_2005 from "./2005.js";
import data_2006 from "./2006.js";
import data_2007 from "./2007.js";
import data_2008 from "./2008.js";
import data_2009 from "./2009.js";
import data_2010 from "./2010.js";
import data_2011 from "./2011.js";
import data_2012 from "./2012.js";
import data_2013 from "./2013.js";
import data_2014 from "./2014.js";
import data_2015 from "./2015.js";
import data_2016 from "./2016.js";
import data_2017 from "./2017.js";
import data_2018 from "./2018.js";
import data_2019 from "./2019.js";
import data_2020 from "./2020.js";
import data_2021 from "./2021.js";
import data_2022 from "./2022.js";
import data_2023 from "./2023.js";
import data_2024 from "./2024.js";
import data_2025 from "./2025.js";
import data_2026 from "./2026.js";

export const YEARS = [1949, 1950, 1951, 1952, 1953, 1954, 1955, 1956, 1957, 1958, 1959, 1960, 1961, 1962, 1963, 1964, 1965, 1966, 1967, 1968, 1969, 1970, 1971, 1972, 1973, 1974, 1975, 1976, 1977, 1978, 1979, 1980, 1981, 1982, 1983, 1984, 1985, 1986, 1987, 1988, 1989, 1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026];

import { STAMP_NOTES } from "./notes.js";

const RAW_STAMP_DATA = [
  ...data_1949,
  ...data_1950,
  ...data_1951,
  ...data_1952,
  ...data_1953,
  ...data_1954,
  ...data_1955,
  ...data_1956,
  ...data_1957,
  ...data_1958,
  ...data_1959,
  ...data_1960,
  ...data_1961,
  ...data_1962,
  ...data_1963,
  ...data_1964,
  ...data_1965,
  ...data_1966,
  ...data_1967,
  ...data_1968,
  ...data_1969,
  ...data_1970,
  ...data_1971,
  ...data_1972,
  ...data_1973,
  ...data_1974,
  ...data_1975,
  ...data_1976,
  ...data_1977,
  ...data_1978,
  ...data_1979,
  ...data_1980,
  ...data_1981,
  ...data_1982,
  ...data_1983,
  ...data_1984,
  ...data_1985,
  ...data_1986,
  ...data_1987,
  ...data_1988,
  ...data_1989,
  ...data_1990,
  ...data_1991,
  ...data_1992,
  ...data_1993,
  ...data_1994,
  ...data_1995,
  ...data_1996,
  ...data_1997,
  ...data_1998,
  ...data_1999,
  ...data_2000,
  ...data_2001,
  ...data_2002,
  ...data_2003,
  ...data_2004,
  ...data_2005,
  ...data_2006,
  ...data_2007,
  ...data_2008,
  ...data_2009,
  ...data_2010,
  ...data_2011,
  ...data_2012,
  ...data_2013,
  ...data_2014,
  ...data_2015,
  ...data_2016,
  ...data_2017,
  ...data_2018,
  ...data_2019,
  ...data_2020,
  ...data_2021,
  ...data_2022,
  ...data_2023,
  ...data_2024,
  ...data_2025,
  ...data_2026,
];

// 将 StampCollection issues 提取的深度资料（原图 + 说明）合并进对应邮票，
// 这样列表封面（StampCard）与详情弹窗（StampModal）都能直接用 stamp.image / stamp.story 等。
export const STAMP_DATA = RAW_STAMP_DATA.map((s) =>
  STAMP_NOTES[s.id] ? { ...s, ...STAMP_NOTES[s.id] } : s
);
export default STAMP_DATA;
