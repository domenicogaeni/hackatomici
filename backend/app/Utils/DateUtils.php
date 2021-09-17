<?php

namespace App\Utils;

use DateTime;
use Exception;
use Moment\Moment;

class DateUtils
{
    public static function today()
    {
        return date('Y-m-d');
    }

    public static function now()
    {
        return date('Y-m-d H:i:s');
    }

    public static function timestamp()
    {
        return time();
    }

    public static function format($date, $format)
    {
        return date($format, strtotime($date));
    }

    public static function milliTimestamp()
    {
        return (int)(microtime(true) * 1000);
    }

    public static function microTimestamp()
    {
        return microtime();
    }

    public static function isValidDate($date, $format = 'Y-m-d')
    {
        $d = DateTime::createFromFormat($format, $date);

        return $d && $d->format($format) === $date;
    }

    public static function isValidDateTime($date, $format = 'Y-m-d H:i:s')
    {
        $d = DateTime::createFromFormat($format, $date);

        return $d && $d->format($format) === $date;
    }

    public static function getYear($date)
    {
        return (int)substr($date, 0, 4);
    }

    public static function getMonth($date)
    {
        return (int)substr($date, 5, 2);
    }

    public static function getDay($date)
    {
        return (int)substr($date, 8, 2);
    }

    public static function itDate($engDate)
    {
        [$y, $m, $d] = explode('-', $engDate);

        return "{$d}/{$m}/{$y}";
    }

    public static function itDateTime($engDate)
    {
        [$date, $time] = explode(' ', $engDate);
        [$y, $m, $d] = explode('-', $date);

        return "{$d}/{$m}/{$y} " . $time;
    }

    public static function trimToDate($dateTime)
    {
        return substr($dateTime, 0, 10);
    }

    public static function dateFromString($string, $startTime = null)
    {
        if ($startTime) {
            return date('Y-m-d', strtotime($string, $startTime));
        }

        return date('Y-m-d', strtotime($string));
    }

    public static function dateTimeFromString($string)
    {
        return date('Y-m-d H:i:s', strtotime($string));
    }

    public static function getDiffDays($dateA, $dateB)
    {
        return round((strtotime($dateA) - strtotime($dateB)) / 86400);
    }

    public static function getDiffDaysFromToday($date)
    {
        return self::getDiffDays($date, self::today());
    }

    public static function getLocalizedDate($date, $format = 'd/m/Y', $locale = 'it_IT')
    {
        try {
            Moment::setLocale($locale);
            $moment = new Moment($date);

            return $moment->format($format);
        } catch (Exception $e) {
            return null;
        }
    }

    public static function dayOfTheYear($date = null)
    {
        return date('z', $date ? strtotime($date) : time()) + 1;
    }
}
