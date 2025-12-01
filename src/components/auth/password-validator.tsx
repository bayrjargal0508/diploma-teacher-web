'use client';
import { useMemo } from 'react';
import { HiOutlineCheck } from 'react-icons/hi';
import {
  LOWERCASE_REG,
  MIN_LENGTH_8_REG,
  ONE_DIGIT_REG,
  UPPERCASE_REG,
} from '@/utils/regex';

interface PasswordValidatorProps {
  password: string;
}

const PasswordValidator = ({ password }: PasswordValidatorProps) => {
  const matchedMinLength8 = useMemo(() => {
    return password?.match(MIN_LENGTH_8_REG);
  }, [password]);

  const matchedUppercase = useMemo(() => {
    return password?.match(UPPERCASE_REG);
  }, [password]);

  const matchedLowercase = useMemo(() => {
    return password?.match(LOWERCASE_REG);
  }, [password]);

  const matchedOneDigit = useMemo(() => {
    return password?.match(ONE_DIGIT_REG);
  }, [password]);

  const allRequirementsMet = useMemo(() => {
    return (
      matchedMinLength8 &&
      matchedUppercase &&
      matchedLowercase &&
      matchedOneDigit
    );
  }, [matchedMinLength8, matchedUppercase, matchedLowercase, matchedOneDigit]);

  if (allRequirementsMet) {
    return null;
  }

  return (
    <ul className="pl-1 text-xs text-label_color">
      <li className="mt-3">
        <div className="flex items-center gap-2">
          <HiOutlineCheck
            className={
              matchedMinLength8 ? 'text-primary' : 'text-system-primary'
            }
            size={16}
          />
          <span className={matchedMinLength8 ? '' : 'text-neutral-gray-2'}>
            Багадаа 8 тэмдэгт оруулах
          </span>
        </div>
      </li>
      <li className="mt-2">
        <div className="flex items-center gap-2">
          <HiOutlineCheck
            className={
              matchedUppercase ? 'text-primary' : 'text-system-primary'
            }
            size={16}
          />
          <span className={matchedUppercase ? '' : 'text-neutral-gray-2'}>
            Том үсэг ашиглах (A-Z)
          </span>
        </div>
      </li>
      <li className="mt-2">
        <div className="flex items-center gap-2">
          <HiOutlineCheck
            className={
              matchedLowercase ? 'text-primary' : 'text-system-primary'
            }
            size={16}
          />
          <span className={matchedLowercase ? '' : 'text-neutral-gray-2'}>
            Жижиг үсэг ашиглах (a-z)
          </span>
        </div>
      </li>
      <li className="mt-2">
        <div className="flex items-center gap-2">
          <HiOutlineCheck
            className={
              matchedOneDigit ? 'text-primary' : 'text-system-primary'
            }
            size={16}
          />
          <span className={matchedOneDigit ? '' : 'text-neutral-gray-2'}>
            Тоон утга оруулах (1-9)
          </span>
        </div>
      </li>
    </ul>
  );
};

export default PasswordValidator;
