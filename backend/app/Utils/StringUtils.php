<?php

namespace App\Utils;

class StringUtils
{
    public static function decamelize($string)
    {
        return strtolower(preg_replace(['/([a-z\d])([A-Z])/', '/([^_])([A-Z][a-z])/'], '$1_$2', $string));
    }

    public const RANDOM_SET_NUMBERS = '0123456789';
    public const RANDOM_SET_ALPHABETIC = 'abcdefghijklmnopqrstuvwxyz';
    public const RANDOM_SET_ALPHABETIC_CASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    public const RANDOM_SET_ALPHANUMERIC = 'abcdefghijklmnopqrstuvwxyz0123456789';
    public const RANDOM_SET_ALPHANUMERIC_CASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    public static function randomString($length, $set = self::RANDOM_SET_ALPHANUMERIC_CASE)
    {
        $string = '';
        $max = strlen($set) - 1;
        for ($i = 0; $i < $length; $i++) {
            $string .= $set[random_int(0, $max)];
        }

        return $string;
    }

    /**
     * Capitalize string.
     *
     * @param $string
     *
     * @return null|mixed|string|string[]
     */
    public static function capitalize($string)
    {
        return mb_strtoupper($string, 'UTF-8');
    }

    /**
     * Replace all accented chars.
     *
     * @param $s
     *
     * @return string
     */
    public static function replaceAccentedChars($s)
    {
        $replace = [
            'Š' => 'S', 'š' => 's', 'Ž' => 'Z', 'ž' => 'z', 'À' => 'A', 'Á' => 'A', 'Â' => 'A', 'Ã' => 'A', 'Ä' => 'A',
            'Å' => 'A', 'Æ' => 'A', 'Ç' => 'C', 'È' => 'E', 'É' => 'E',
            'Ê' => 'E', 'Ë' => 'E', 'Ì' => 'I', 'Í' => 'I', 'Î' => 'I', 'Ï' => 'I', 'Ñ' => 'N', 'Ò' => 'O', 'Ó' => 'O',
            'Ô' => 'O', 'Õ' => 'O', 'Ö' => 'O', 'Ø' => 'O', 'Ù' => 'U',
            'Ú' => 'U', 'Û' => 'U', 'Ü' => 'U', 'Ý' => 'Y', 'Þ' => 'B', 'ß' => 'Ss', 'à' => 'a', 'á' => 'a', 'â' => 'a',
            'ã' => 'a', 'ä' => 'a', 'å' => 'a', 'æ' => 'a', 'ç' => 'c',
            'è' => 'e', 'é' => 'e', 'ê' => 'e', 'ë' => 'e', 'ì' => 'i', 'í' => 'i', 'î' => 'i', 'ï' => 'i', 'ð' => 'o',
            'ñ' => 'n', 'ò' => 'o', 'ó' => 'o', 'ô' => 'o', 'õ' => 'o',
            'ö' => 'o', 'ø' => 'o', 'ù' => 'u', 'ú' => 'u', 'û' => 'u', 'ý' => 'y', 'þ' => 'b', 'ÿ' => 'y',
        ];

        return strtr($s, $replace);
    }

    /**
     * Convert strange ascii chars.
     *
     * @param $string
     *
     * @return null|mixed|string|string[]
     */
    public static function convertAscii($string)
    {
        // Replace Single Curly Quotes
        $search[] = chr(226) . chr(128) . chr(152);
        $replace[] = "'";
        $search[] = chr(226) . chr(128) . chr(153);
        $replace[] = "'";
        // Replace Smart Double Curly Quotes
        $search[] = chr(226) . chr(128) . chr(156);
        $replace[] = '"';
        $search[] = chr(226) . chr(128) . chr(157);
        $replace[] = '"';
        // Replace En Dash
        $search[] = chr(226) . chr(128) . chr(147);
        $replace[] = '--';
        // Replace Em Dash
        $search[] = chr(226) . chr(128) . chr(148);
        $replace[] = '---';
        // Replace Bullet
        $search[] = chr(226) . chr(128) . chr(162);
        $replace[] = '*';
        // Replace Middle Dot
        $search[] = chr(194) . chr(183);
        $replace[] = '*';
        // Replace Ellipsis with three consecutive dots
        $search[] = chr(226) . chr(128) . chr(166);
        $replace[] = '...';
        // Apply Replacements
        $string = str_replace($search, $replace, $string);
        // Remove any non-ASCII Characters
        return preg_replace("/[^\x01-\x7F]/", '', $string);
    }

    /**
     * Remove a capo.
     *
     * @param $string
     *
     * @return mixed
     */
    public static function removeAcapo($string)
    {
        return str_replace(["\n\r", "\n", "\r", "\t"], ' ', $string);
    }

    /**
     * Find the last character position of the first occurrence of a substring in a string.
     *
     * @param string $haystack
     * @param mixed  $needle
     * @param int    $offset
     *
     * @return bool|int
     */
    public static function strposEnd($haystack, $needle, $offset = null)
    {
        $pos = strpos($haystack, $needle, $offset);
        if ($pos === false) {
            return false;
        }

        return $pos + strlen($needle);
    }

    /**
     * Hide email address with *.
     *
     * @param $email
     *
     * @return string
     */
    public static function hideEmailAddress($email)
    {
        if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
            [$first, $last] = explode('@', $email);
            $first = str_replace(substr($first, '1'), str_repeat('*', strlen($first) - 1), $first);
            $last = explode('.', $last);
            $lastDomain = str_replace(substr($last['0'], '1'), str_repeat('*', strlen($last['0']) - 1), $last['0']);

            return $first . '@' . $lastDomain . '.' . $last['1'];
        }

        return $email;
    }
}
