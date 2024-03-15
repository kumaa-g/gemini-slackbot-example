export const messages: {
  [CODE: string]: string;
} = {
  DEFAULT_ERROR_MESSAGE:
    '予期せぬエラーが発生しました. 新規スレッドで会話を始めてみてください...',
  INVALID_TEXT_INPUT:
    '1文字以上の文字を入力するか, なんらかのファイルを入力してください',
  INVALID_IMAGE_INPUT: '無効なファイルパスです',
  INVALID_CONTEXT: '最低一つのプロンプトや, ファイルを入力してください',
  UNEXPECTED_OUTPUT: '予期せぬ出力だったので消しました',
} as const;
